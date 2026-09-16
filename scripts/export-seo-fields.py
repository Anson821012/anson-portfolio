"""Export the five editorial fields from built HTML for the owner's review."""
import argparse
import json
from pathlib import Path
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser()
parser.add_argument('--site', type=Path, required=True)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
rows = []
for path in sorted(args.site.rglob('index.html')):
    if '__review__' in path.parts:
        continue
    soup = BeautifulSoup(path.read_text(), 'html.parser')
    graph = json.loads(soup.select_one('script[type="application/ld+json"]').string)['@graph']
    article = next((e for e in graph if e['@type'] == 'Article'), None)
    rows.append({
        '網址': soup.select_one('link[rel=canonical]')['href'],
        '頁面名稱': soup.h1.get_text(' ', strip=True),
        '部落格標題': article['headline'] if article else None,
        '標籤': [tag.get_text() for tag in soup.select('.topic-tags li')],
        '網頁標題': soup.title.string,
        '網頁描述': soup.select_one('meta[name=description]')['content'],
        '網頁關鍵字': soup.select_one('meta[name=keywords]')['content'],
    })
args.out.mkdir(parents=True, exist_ok=True)
(args.out/'SEO五欄位設定.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2)+'\n')
lines = ['# 麻煩整理所：SEO 五欄位設定', '',
         '部落格名稱：蔡鈞佑 Anson Tsai 的 AI 轉型與品牌整理筆記。', '',
         '以下從建置完成的網頁直接匯出，與實際標題、描述及關鍵字一致。非文章頁的「部落格標題」不適用。', '',
         '「網頁關鍵字」依需求保留為 meta keywords；[Google 不將此欄位用於排名](https://developers.google.com/search/docs/crawling-indexing/special-tags)。主要定位仍由可見內容、標題、作者、服務與案例共同呈現。', '']
for row in rows:
    lines.extend([f"## {row['頁面名稱']}", '', f"[正式網址]({row['網址']})", '',
                  f"- **部落格標題：** {row['部落格標題'] or '不適用（非文章頁）'}",
                  f"- **標籤：** {'、'.join(row['標籤']) or '首頁以 AI 轉型及品牌營運定位呈現'}",
                  f"- **網頁標題：** {row['網頁標題']}",
                  f"- **網頁描述：** {row['網頁描述']}",
                  f"- **網頁關鍵字：** {row['網頁關鍵字']}", ''])
(args.out/'SEO五欄位設定.md').write_text('\n'.join(lines))
print(f'Exported {len(rows)} pages to {args.out}')
