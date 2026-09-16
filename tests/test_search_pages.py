import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://anson821012.github.io/anson-portfolio/'


class SearchPagesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.dest = Path(cls.temp.name)
        subprocess.run(['node', 'scripts/build.mjs', str(cls.dest)], cwd=ROOT, check=True, capture_output=True)
        cls.pages = {p.relative_to(cls.dest).as_posix(): BeautifulSoup(p.read_text(), 'html.parser') for p in cls.dest.rglob('*.html')}

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def test_all_canonical_pages_are_in_sitemap_and_indexable(self):
        urls = [el.text for el in ET.parse(self.dest / 'sitemap.xml').findall('.//{*}loc')]
        self.assertEqual(len(urls), 22)
        self.assertEqual(len(urls), len(set(urls)))
        self.assertEqual(len(self.pages), len(urls))
        for filename, soup in self.pages.items():
            expected = BASE + filename.removesuffix('index.html')
            with self.subTest(page=filename):
                self.assertEqual(soup.select_one('link[rel=canonical]')['href'], expected)
                self.assertIn(expected, urls)
                self.assertIsNone(soup.select_one('meta[name=robots]'))
                self.assertEqual(len(soup.select('h1')), 1)
                self.assertTrue(soup.select_one('meta[name=description]')['content'])

    def test_all_local_links_and_assets_resolve_without_javascript(self):
        for filename, soup in self.pages.items():
            for element in soup.select('[href], [src]'):
                value = element.get('href') or element.get('src')
                resolved = urlparse(urljoin(BASE + filename, value))
                if resolved.netloc != urlparse(BASE).netloc or not resolved.path.startswith('/anson-portfolio/'):
                    continue
                relative = unquote(resolved.path.removeprefix('/anson-portfolio/'))
                target = self.dest / relative
                if target.is_dir():
                    target /= 'index.html'
                with self.subTest(page=filename, link=value):
                    self.assertTrue(target.is_file(), f'Missing {target}')
                    if resolved.fragment and target.suffix == '.html':
                        # The homepage planner creates individual case cards in JavaScript;
                        # every case also has a separate crawlable static page.
                        if target == self.dest/'index.html' and resolved.fragment.startswith('case-'):
                            continue
                        linked = self.pages[target.relative_to(self.dest).as_posix()]
                        self.assertIsNotNone(linked.find(id=unquote(resolved.fragment)))

    def test_catalogue_and_cases_exist_in_initial_html(self):
        soup = self.pages['services/index.html']
        self.assertEqual(len(soup.select('.catalogue-item')), 125)
        self.assertEqual(len(soup.select('.catalogue-category')), 24)
        self.assertEqual(len(soup.select('.catalogue-facet')), 6)
        self.assertEqual(len(self.pages['cases/index.html'].select('.editorial-card')), 9)
        for case in ['menu', 'payroll', 'content']:
            self.assertIn('製作動機', self.pages[f'cases/{case}/index.html'].get_text())
        self.assertEqual(len(self.pages['notes/index.html'].select('.editorial-card')), 4)

    def test_structured_data_ids_titles_and_author_are_consistent(self):
        titles = []
        for filename, soup in self.pages.items():
            graph = json.loads(soup.select_one('script[type="application/ld+json"]').string)['@graph']
            ids = [entity['@id'] for entity in graph]
            with self.subTest(page=filename):
                self.assertEqual(len(ids), len(set(ids)))
                self.assertEqual(next(e for e in graph if e['@type'] == 'Person')['name'], '蔡鈞佑')
                article = next((e for e in graph if e['@type'] == 'Article'), None)
                if article:
                    self.assertIn(article['author']['@id'], ids)
            titles.append(soup.title.string)
        self.assertEqual(len(titles), len(set(titles)))

    def test_editorial_fields_and_ai_identity_are_present(self):
        for filename, soup in self.pages.items():
            with self.subTest(page=filename):
                for name in ['description', 'keywords', 'author']:
                    matches = soup.select(f'meta[name="{name}"]')
                    self.assertEqual(len(matches), 1)
                    self.assertTrue(matches[0]['content'].strip())
                self.assertIn('蔡鈞佑 Anson Tsai', soup.title.string)
                self.assertIn('蔡鈞佑 Anson Tsai', soup.select_one('meta[name=keywords]')['content'])
                self.assertEqual(soup.select_one('meta[property="og:title"]')['content'], soup.title.string)
                graph = json.loads(soup.select_one('script[type="application/ld+json"]').string)['@graph']
                person = next(e for e in graph if e['@type'] == 'Person')
                self.assertIn('蔡鈞佑 Anson Tsai', person['alternateName'])
                self.assertIn('中小企業 AI 轉型', person['knowsAbout'])
                article = next((e for e in graph if e['@type'] == 'Article'), None)
                if article:
                    self.assertEqual(article['headline'], soup.h1.get_text())
                    self.assertEqual(article['keywords'], [tag.get_text() for tag in soup.select('.topic-tags li')])
                    self.assertIn('蔡鈞佑 Anson Tsai', soup.select_one('.author-intro').get_text())
        for filename in ['index.html', 'about/index.html', 'services/ai-integration/index.html']:
            visible = self.pages[filename].body.get_text(' ', strip=True)
            self.assertIn('蔡鈞佑', visible)
            self.assertIn('AI 轉型', visible)

    def test_preview_is_excluded_and_production_removes_review_hub(self):
        subprocess.run(['node', 'scripts/build.mjs', str(self.dest), '--review'], cwd=ROOT, check=True, capture_output=True)
        for page in self.dest.rglob('*.html'):
            soup = BeautifulSoup(page.read_text(), 'html.parser')
            self.assertEqual(soup.select_one('meta[name=robots]')['content'], 'noindex,nofollow')
        self.assertTrue((self.dest/'__review__/index.html').is_file())
        self.assertNotIn('__review__', (self.dest/'sitemap.xml').read_text())
        subprocess.run(['node', 'scripts/build.mjs', str(self.dest)], cwd=ROOT, check=True, capture_output=True)
        self.assertFalse((self.dest/'__review__').exists())


if __name__ == '__main__':
    unittest.main()
