import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {questions, validAnswers, recommend, guideSummary, mergeSelectionIds} from '../needs-guide-state.mjs';

const context={};
vm.runInNewContext(readFileSync(new URL('../catalogue.js',import.meta.url),'utf8')+';this.catalogue=serviceData.categories.flatMap(c=>c.services);',context);
vm.runInNewContext(readFileSync(new URL('../portfolio.js',import.meta.url),'utf8')+';this.caseIds=portfolioCases.map(c=>c.id);',context);
const catalogue=JSON.parse(JSON.stringify(context.catalogue));

test('all 72 answer paths point to two distinct real services and an existing case',()=>{
  let count=0;
  for(const pain of questions[0].options)for(const method of questions[1].options)for(const goal of questions[2].options){
    const answer={pain:pain.id,method:method.id,goal:goal.id};
    const result=recommend(answer,catalogue);
    assert.ok(validAnswers(answer));
    assert.equal(result.services.length,2,JSON.stringify(answer));
    assert.equal(new Set(result.services.map(s=>s.id)).size,2);
    for(const service of result.services){assert.ok(service.name);assert.ok(service.delivery);assert.ok(service.reason);}
    assert.ok(context.caseIds.includes(result.caseId));
    assert.ok(result.summary.includes(pain.label));
    assert.ok(result.summary.includes(method.label));
    assert.ok(result.summary.includes(goal.label));
    count++;
  }
  assert.equal(count,72);
});
test('incomplete or invalid answers never produce a recommendation',()=>{
  for(const answer of [undefined,{}, {pain:'data'}, {pain:'data',method:'tools',goal:'invalid'}]){
    assert.equal(validAnswers(answer),false);
    assert.equal(recommend(answer,catalogue),null);
    assert.equal(guideSummary(answer),'');
  }
});
test('a data request adjusts for the intended scope and existing working method',()=>{
  const ids=answer=>recommend(answer,catalogue).services.map(s=>s.id);
  assert.deepEqual(ids({pain:'data',method:'tools',goal:'small-win'}),['data-classification','workflow-integration']);
  assert.deepEqual(ids({pain:'data',method:'scattered',goal:'clarity'}),['workflow-audit','data-cleanup']);
  assert.deepEqual(ids({pain:'data',method:'person',goal:'handoff'}),['document-version','data-classification']);
});
test('adding recommendations preserves existing choices, removes duplicates and rejects unknown IDs',()=>{
  const existing=['brand-position','sop'];
  const incoming=['sop','data-classification','unknown'];
  const ids=catalogue.map(s=>s.id);
  assert.deepEqual(mergeSelectionIds(existing,incoming,ids),['brand-position','sop','data-classification']);
  assert.deepEqual(existing,['brand-position','sop']);
  assert.deepEqual(mergeSelectionIds(existing,[],ids),existing);
  const first=mergeSelectionIds(existing,incoming,ids);
  assert.deepEqual(mergeSelectionIds(first,incoming,ids),first);
});
