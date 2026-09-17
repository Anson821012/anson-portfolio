import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSelection,readSelection,inquirySummary,inquiryURL,formEntry,formURL} from '../consultation-state.mjs';
const catalogue=[{id:'one',name:'排班與出勤流程'},{id:'two',name:'SOP 與交接'}];
test('stored selections reject unknown IDs, duplicates and invalid note values',()=>{
 assert.deepEqual(normalizeSelection({ids:['one','one','fake','two'],note:42},catalogue),{ids:['one','two'],note:''});
 assert.equal(normalizeSelection({note:'字'.repeat(2100)},catalogue).note.length,2000);
 assert.deepEqual(readSelection({getItem(){throw Error('blocked')}},catalogue),{ids:[],note:''});
 assert.deepEqual(readSelection({getItem(){return '{bad'}},catalogue),{ids:[],note:''});
});
test('inquiry retains Chinese, newlines and reserved URL characters without changing destination',()=>{
 const state={ids:['two','one'],note:'希望聊聊 A&B，另附 https://example.com/?x=1#文字'};
 const summary=inquirySummary(state,catalogue,'合作討論');
 const url=new URL(inquiryURL(summary,true));
 assert.equal(url.origin+url.pathname,formURL);
 assert.equal(url.searchParams.get(formEntry),summary);
 assert.equal(url.searchParams.get('embedded'),'true');
 assert.match(summary,/SOP 與交接\n・排班與出勤流程/);
 assert.equal(url.hash,'');
 assert.equal(new URL(inquiryURL(summary)).searchParams.has('embedded'),false);
});
import {formPreparation} from '../consultation-state.mjs';
test('long Chinese inquiries remain available in full without generating an oversized form URL',()=>{
 const long='需要整理品牌營運與數位流程。'.repeat(160);
 const prepared=formPreparation(long);
 assert.equal(prepared.needsPaste,true);
 assert.equal(prepared.summary,long);
 assert.ok(prepared.embeddedURL.length<7000);
 assert.match(new URL(prepared.url).searchParams.get(formEntry),/清單較長/);
 assert.equal(formPreparation('一件小事').needsPaste,false);
});
