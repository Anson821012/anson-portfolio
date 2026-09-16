import copy
import datetime as dt
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('sync', ROOT/'scripts/sync.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.search = json.loads((ROOT/'data/search.json').read_text())

    def test_failure_preserves_payload_and_success_date(self):
        def failed(): raise ValueError('Source changed')
        now = dt.datetime(2026,9,17,tzinfo=dt.timezone.utc)
        result, error = sync.refresh(self.search,failed,now)
        self.assertEqual(result['daily'],self.search['daily'])
        self.assertEqual(result['last_success'],self.search['last_success'])
        self.assertEqual(result['status'],'error')
        self.assertEqual(error,'ValueError')

    def test_aggregates_and_duplicate_dates_are_rejected(self):
        self.assertIs(sync.validate_search(self.search),self.search)
        invalid = copy.deepcopy(self.search)
        invalid['totals']['clicks'] += 1
        with self.assertRaises(AssertionError): sync.validate_search(invalid)
        invalid = copy.deepcopy(self.search)
        invalid['daily'][1]['date'] = invalid['daily'][0]['date']
        with self.assertRaises(AssertionError): sync.validate_search(invalid)

    def test_leap_year_window(self):
        window = sync.annual_window(dt.date(2024,2,29))
        self.assertEqual(window,{'start':'2023-03-01','end':'2024-02-29'})

    def test_only_credited_articles_and_safe_urls(self):
        markup = '<div id="article_content"><h1>品牌故事</h1><div class="article_date"><span>2026-09-15</span></div><div id="ckeditor"><p>編輯 徐彥戎、蔡鈞佑／高雄報導</p></div></div>'
        parsed = sync.parse_article(markup,'https://www.fuyunlovemommy.com/blogs/news/story')
        self.assertIn('徐彥戎',parsed['credit'])
        self.assertIsNone(sync.parse_article(markup.replace('編輯 徐彥戎、蔡鈞佑','受訪者 蔡鈞佑'),'test'))
        self.assertIsNone(sync.article_url('https://evil.example/blogs/news/one'))
        self.assertIsNone(sync.article_url('javascript:alert(1)'))
        self.assertIsNone(sync.article_url('/blogs/news/tagged/蔡鈞佑'))

    def test_missing_article_structure_is_not_success(self):
        with self.assertRaises(ValueError): sync.parse_article('<h1>Access denied</h1>','test')


if __name__ == '__main__': unittest.main()
