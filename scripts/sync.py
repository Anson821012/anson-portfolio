"""Fetch public article credits and read-only Search Console aggregates.

Credentials enter only through GSC_ACCESS_TOKEN; no credentials are serialized.
Network/source failures retain the last successful payload and its timestamp.
"""
import argparse
import calendar
import copy
import datetime as dt
import json
import math
import os
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from zoneinfo import ZoneInfo

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = "https://anson821012.github.io/anson-portfolio/"
BRAND = "https://www.fuyunlovemommy.com"
PROPERTY = "sc-domain:fuyunlovemommy.com"
CATEGORIES = ["news", "口碑好評", "坐月子qa", "嬰兒與健康專欄", "術後修復與營養照護", "媒體報導"]


def request(url, payload=None, token=None):
    headers = {"User-Agent": "AnsonPortfolioSync/1.0", "Accept": "application/json,text/html"}
    if token:
        headers["Authorization"] = "Bearer " + token
    if payload is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=None if payload is None else json.dumps(payload).encode(), headers=headers)
    with urllib.request.urlopen(req, timeout=25) as response:
        raw = response.read(5_000_001)
        if len(raw) > 5_000_000:
            raise ValueError("Source exceeds response limit")
        return raw.decode("utf-8")


def date(value):
    return dt.date.fromisoformat(value)


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and value >= 0


def validate_search(data):
    assert data["schema"] == 1 and data["property"] == PROPERTY
    days = data["daily"]
    assert 0 < len(days) <= 366
    assert [r["date"] for r in days] == sorted({r["date"] for r in days})
    start, end = date(data["requested"]["start"]), date(data["requested"]["end"])
    for row in days:
        assert start <= date(row["date"]) <= end
        assert all(number(row[k]) and int(row[k]) == row[k] for k in ("clicks", "impressions"))
        assert row["clicks"] <= row["impressions"]
    for key in ("clicks", "impressions"):
        assert sum(r[key] for r in days) == data["totals"][key]
    assert number(data["totals"]["position"])
    assert data["totals"]["impressions"] > 0
    assert abs(data["totals"]["ctr"] - data["totals"]["clicks"] / data["totals"]["impressions"]) < 1e-8
    return data


def article_url(value):
    url = urllib.parse.urlsplit(urllib.parse.urljoin(BRAND, value))
    parts = urllib.parse.unquote(url.path).strip("/").split("/")
    if url.scheme != "https" or url.netloc != "www.fuyunlovemommy.com" or len(parts) != 3 or parts[0] != "blogs" or parts[2] == "tagged":
        return None
    return BRAND + urllib.parse.quote(urllib.parse.unquote(url.path), safe="/-._~")


def validate_content(data):
    assert data["schema"] == 1 and data["source"] == BRAND
    assert isinstance(data["items"], list) and len(data["items"]) <= 12
    for item in data["items"]:
        assert article_url(item["url"]) == item["url"]
        assert isinstance(item["title"], str) and 0 < len(item["title"]) <= 250
        assert "蔡鈞佑" in item["credit"] and len(item["credit"]) <= 200
        date(item["published"])
    return data


def previous(name, online):
    validator = validate_search if name == "search" else validate_content
    local = validator(json.loads((ROOT / "data" / (name + ".json")).read_text()))
    if online:
        try:
            remote = validator(json.loads(request(PUBLIC + "data/" + name + ".json")))
            if (remote.get("last_success") or "") > (local.get("last_success") or ""):
                return remote
        except (OSError, ValueError, KeyError, TypeError, AssertionError):
            pass  # The committed, verified snapshot remains the first-run fallback.
    return local


def annual_window(today):
    # Include today and go back one calendar year; supports leap days.
    prior_year = today.replace(year=today.year - 1, day=min(today.day, calendar.monthrange(today.year - 1, today.month)[1]))
    return {"start": (prior_year + dt.timedelta(days=1)).isoformat(), "end": today.isoformat()}


def fetch_search(token, now):
    window = annual_window(now.astimezone(ZoneInfo("America/Los_Angeles")).date())
    endpoint = "https://www.googleapis.com/webmasters/v3/sites/" + urllib.parse.quote(PROPERTY, safe="") + "/searchAnalytics/query"
    common = {"startDate": window["start"], "endDate": window["end"], "type": "web", "dataState": "final", "aggregationType": "byProperty"}
    raw = json.loads(request(endpoint, dict(common, dimensions=["date"], rowLimit=25000), token))
    daily = sorted([{"date": r["keys"][0], "clicks": r["clicks"], "impressions": r["impressions"]} for r in raw.get("rows", [])], key=lambda r: r["date"])
    totals_rows = json.loads(request(endpoint, common, token)).get("rows", [])
    if not daily or len(totals_rows) != 1:
        raise ValueError("No complete search data")
    totals = {k: totals_rows[0][k] for k in ("clicks", "impressions", "ctr", "position")}
    result = {"schema": 1, "property": PROPERTY, "search_type": "web", "requested": window, "daily": daily, "totals": totals,
              "mode": "api", "status": "ok", "last_success": now.isoformat(), "last_attempt": now.isoformat()}
    # Separate requests must agree before replacing the last successful snapshot.
    return validate_search(result)


def listing_links(html):
    soup = BeautifulSoup(html, "html.parser")
    return list(dict.fromkeys(url for a in soup.select("a[href]") if (url := article_url(a["href"]))))[:8]


def parse_article(html, url):
    soup = BeautifulSoup(html, "html.parser")
    body = soup.select_one("#article_content #ckeditor")
    title = soup.select_one("#article_content h1")
    published = soup.select_one("#article_content .article_date span")
    if not body or not title or not published:
        raise ValueError("Article layout changed")
    # Match an explicit byline inside the article, not mentions in navigation or related posts.
    credits = []
    for element in body.select("p"):
        text = " ".join(element.get_text(" ", strip=True).split())
        if len(text) <= 200 and re.search(r"(?:編輯|撰文|作者|企劃)[^。！？\n]{0,70}蔡鈞佑", text):
            credits.append(text)
    if not credits:
        return None
    day = published.get_text(strip=True)[:10]
    date(day)
    return {"url": url, "title": title.get_text(" ", strip=True)[:250], "published": day, "credit": min(credits, key=len)}


def fetch_content(now):
    listings = [BRAND + "/blogs/" + urllib.parse.quote(c) for c in CATEGORIES]
    with ThreadPoolExecutor(max_workers=3) as pool:
        links = sorted(set(url for page in pool.map(request, listings) for url in listing_links(page)))
        if not links:
            raise ValueError("No article links")
        items = list(pool.map(lambda url: parse_article(request(url), url), links))
    # Fail the whole source on a missing/broken page so it cannot appear fully current.
    items = sorted([item for item in items if item and date(item["published"]) <= now.astimezone(ZoneInfo("Asia/Taipei")).date()], key=lambda r: (r["published"], r["url"]), reverse=True)[:12]
    if not items:
        raise ValueError("No verified author credits")
    return validate_content({"schema": 1, "source": BRAND, "items": items, "status": "ok", "last_success": now.isoformat(), "last_attempt": now.isoformat()})


def refresh(old, fetcher, now, enabled=True):
    if enabled:
        try:
            return fetcher(), None
        except (OSError, ValueError, KeyError, TypeError, AssertionError) as error:
            # Avoid logging HTTP bodies or credentials; expose only a diagnostic class.
            reason = type(error).__name__
    else:
        reason = "awaiting_auth"
    result = copy.deepcopy(old)
    result.update(status="awaiting_auth" if not enabled else "error", last_attempt=now.isoformat())
    return result, reason


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / "_site/data")
    parser.add_argument("--use-live-fallback", action="store_true")
    args = parser.parse_args()
    now = dt.datetime.now(dt.timezone.utc)
    token = os.environ.get("GSC_ACCESS_TOKEN")
    failures = []
    args.output.mkdir(parents=True, exist_ok=True)
    for name, fetcher, enabled in [("search", lambda: fetch_search(token, now), bool(token)), ("content", lambda: fetch_content(now), True)]:
        old = previous(name, args.use_live_fallback)
        result, error = refresh(old, fetcher, now, enabled)
        if name == "search" and not token and os.environ.get("GSC_CONFIGURED") == "true":
            result["status"] = "error"
            error = "AuthenticationFailed"
            failures.append(name)
        (args.output / (name + ".json")).write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
        print(name + ": " + result["status"] + (" (" + error + ")" if error else ""))
        if error and enabled:
            failures.append(name)
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            output.write("failed=" + ",".join(failures) + "\n")


if __name__ == "__main__":
    main()
