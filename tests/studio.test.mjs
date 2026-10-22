import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {studioZones,studioPalette} from '../studio-data.mjs';

test('interactive studio has six complete and unique work zones',()=>{
  assert.equal(studioZones.length,6);
  assert.equal(new Set(studioZones.map(zone=>zone.id)).size,6);
  assert.equal(new Set(studioZones.map(zone=>zone.scene)).size,6);
  for(const zone of studioZones){
    assert.match(zone.color,/^#[0-9a-f]{6}$/i);
    assert.match(zone.accent,/^#[0-9a-f]{6}$/i);
    assert.ok(zone.problem.length>10);
    assert.ok(zone.answer.length>15);
    assert.ok(zone.deliver.length>=3);
    assert.ok(zone.services.length>=2);
    assert.ok(zone.level.length>=2);
    assert.ok(zone.reward.includes('徽章'));
    assert.equal(zone.quiz.options.length,3);
    assert.ok(Number.isInteger(zone.quiz.correct));
    assert.ok(zone.quiz.correct>=0&&zone.quiz.correct<zone.quiz.options.length);
    assert.ok(zone.quiz.hint.length>10);
    assert.ok(zone.quiz.success.length>10);
    assert.match(zone.serviceHref,/^\.\.\/services\//);
    assert.match(zone.caseHref,/^\.\.\/cases\//);
  }
  assert.equal(studioPalette.sky,'#f2f8fb');
  assert.equal(studioPalette.white,'#ffffff');
});

test('studio service buttons only reference real catalogue items',async()=>{
  const source=await readFile(new URL('../catalogue.js',import.meta.url),'utf8');
  const data=vm.runInNewContext(source+'; serviceData;');
  const known=new Set(data.categories.flatMap(category=>category.services.map(service=>service.id)));
  for(const zone of studioZones){
    for(const service of zone.services)assert.ok(known.has(service.id),`${service.id} must exist in catalogue.js`);
  }
});

test('studio scene uses bundled three.js and accessible HTML controls',async()=>{
  const [script,style]=await Promise.all([
    readFile(new URL('../studio.mjs',import.meta.url),'utf8'),
    readFile(new URL('../studio.css',import.meta.url),'utf8')
  ]);
  assert.match(script,/\.\/vendor\/three-0\.180\.0\/three\.module\.min\.js/);
  assert.match(script,/prefers-reduced-motion/);
  assert.match(script,/dataset\.renderer='fallback'/);
  assert.match(script,/anson-marketing-quest-v1/);
  assert.match(script,/localStorage\.setItem/);
  assert.match(style,/--studio-sky:#f2f8fb/);
  assert.match(style,/studio-progress-track/);
  assert.match(style,/@media\(max-width:800px\)/);
});

test('powder-blue theme is shared across the whole site',async()=>{
  const [theme,home,build]=await Promise.all([
    readFile(new URL('../theme.css',import.meta.url),'utf8'),
    readFile(new URL('../index.html',import.meta.url),'utf8'),
    readFile(new URL('../scripts/build.mjs',import.meta.url),'utf8')
  ]);
  assert.match(theme,/--paper:#f5f9fc/);
  assert.match(theme,/\.editorial-card/);
  assert.match(theme,/\.growth-metric/);
  assert.match(home,/href="theme\.css"/);
  assert.match(build,/'theme\.css'/);
});
