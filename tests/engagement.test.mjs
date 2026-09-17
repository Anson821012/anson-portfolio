import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=readFileSync(new URL('../backend/Code.gs',import.meta.url),'utf8');
function backend(){
  const data={Inquiries:[],Comments:[],Hearts:[]},cache=new Map(),mail=[];
  const sheet=name=>({
    getLastRow:()=>data[name].length+1,
    appendRow:row=>data[name].push(row),
    getRange:(r,c,n=1,m=1)=>({getValues:()=>data[name].slice(r-2,r-2+n).map(row=>row.slice(c-1,c-1+m)),setValues:rows=>rows.forEach((row,i)=>row.forEach((value,j)=>data[name][r-2+i][c-1+j]=value)),setValue:value=>data[name][r-2][c-1]=value})
  });
  const book={getSheetByName:sheet,getUrl:()=> 'https://docs.google.com/private-sheet'};
  const context=vm.createContext({console,Date,JSON,Error,PropertiesService:{getScriptProperties:()=>({getProperty:key=>({DATA_SHEET:'private',VISITOR_SALT:'salt'}[key])})},SpreadsheetApp:{openById:()=>book,flush:()=>{}},Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,value)=>Array.from(createHash('sha256').update(value).digest())},LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock:()=>{}})},CacheService:{getScriptCache:()=>({get:key=>cache.get(key),put:(key,value)=>cache.set(key,value)})},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})},MailApp:{sendEmail:value=>mail.push(value)}});
  vm.runInContext(source,context);
  const post=p=>context.doPost({postData:{contents:JSON.stringify({visitor:'browser-00000000-0000-0000-0000',request:'request-0000000-0000-0000-0000',...p})}});
  return {context,data,post,mail};
}
test('inquiry is saved once, notification is fixed to owner, public reads cannot expose private fields',()=>{
  const b=backend(),p={action:'lead',name:'=HYPERLINK("bad")',email:'test@example.com',message:'測試，不是真實客戶',entry:'/notes/',page:'/contact/',referrer:'google.com'};
  assert.equal(b.post(p).ok,true);assert.equal(b.post(p).duplicate,true);assert.equal(b.data.Inquiries.length,1);assert.equal(b.mail.length,1);assert.equal(b.mail[0].to,'yo30437@gmail.com');assert.ok(b.data.Inquiries[0][2].startsWith("'="));
  const output=JSON.stringify(b.context.doGet({parameter:{article:'ai-first-step'}}));assert.ok(!output.includes('test@example.com'));assert.ok(!output.includes('private-sheet'));
});
test('comments are private until approved and repeat submissions are idempotent',()=>{
  const b=backend(),p={action:'comment',article:'ai-first-step',name:'小安',message:'這是我的想法'};
  b.post(p);b.post(p);assert.equal(b.data.Comments.length,1);assert.equal(b.data.Comments[0][5],'待審核');
  assert.equal(b.context.doGet({parameter:{article:'ai-first-step'}}).comments.length,0);
  b.data.Comments[0][5]='公開';assert.equal(b.context.doGet({parameter:{article:'ai-first-step'}}).comments[0].text,'這是我的想法');
});
test('heart is one state per browser and article, supports undo and rejects unknown operations',()=>{
  const b=backend(),p={action:'heart',article:'ai-first-step',liked:true};
  assert.equal(b.post(p).hearts,1);assert.equal(b.post(p).hearts,1);assert.equal(b.post({...p,liked:false}).hearts,0);assert.equal(b.data.Hearts.length,1);
  assert.equal(b.post({...p,article:'../../private'}).ok,false);assert.equal(b.post({...p,liked:'true'}).ok,false);assert.equal(b.post({action:'delete'}).ok,false);
});
test('honeypot and per-browser submission limits reject excess writes',()=>{
  const b=backend(),p={action:'comment',article:'ai-first-step',name:'小安',message:'一個問題'};
  assert.equal(b.post({...p,website:'spam'}).ok,false);
  for(let i=0;i<5;i++)assert.equal(b.post({...p,request:'request-0000000-0000-0000-000'+i}).ok,true);
  assert.equal(b.post({...p,request:'request-0000000-0000-0000-0009'}).error,'rate_limit');
});
