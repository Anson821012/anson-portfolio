import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {monthsFor,renderSearch,renderContent} from '../growth-view.mjs';
const data = JSON.parse(readFileSync(new URL('../data/search.json',import.meta.url)));

test('verified partial-year coverage and only complete-month comparison',()=>{
  const view = renderSearch(data);
  assert.match(view.cards,/2,918/);
  assert.match(view.coverage,/103 天/);
  assert.match(view.chart,/43.9%/);
  assert.match(view.coverage,/待授權/);
  assert.equal(monthsFor(data.daily).filter(m=>m.full).length,2);
});
test('missing days cannot count as a full month',()=>{
  const partial = data.daily.filter(r=>r.date !== '2026-08-15');
  assert.equal(monthsFor(partial).find(m=>m.month === '2026-08').full,false);
});
test('external links and HTML are not executed',()=>{
  const content = {schema:1,source:'https://www.fuyunlovemommy.com',status:'ok',last_success:'2026-09-16',items:[
    {url:'https://www.fuyunlovemommy.com/blogs/news/test',title:'<img onerror=alert(1)>',credit:'編輯 蔡鈞佑',published:'2026-09-15'},
    {url:'https://evil.example/',title:'bad',credit:'蔡鈞佑',published:'2026-09-15'}
  ]};
  const html=renderContent(content);
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes('evil.example'));
});
