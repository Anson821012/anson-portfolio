import {engagementEndpoint} from './site-config.mjs?v=20260917b';
const key='less-trouble-office:interaction-id';
let memoryId;
export function visitor(create=false){
  try{const saved=localStorage.getItem(key);if(/^[a-z0-9-]{24,80}$/i.test(saved||''))return saved;}catch{}
  if(!create)return memoryId||'';
  memoryId=memoryId||crypto.randomUUID();try{localStorage.setItem(key,memoryId);}catch{}
  return memoryId;
}
export async function request(payload){
  if(!engagementEndpoint)throw Error('unavailable');
  const response=await fetch(engagementEndpoint,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({...payload,visitor:visitor(true)}),signal:AbortSignal.timeout(35000)});
  const data=await response.json();if(!data.ok)throw Error(data.error||'unavailable');return data;
}
export async function readArticle(article){
  if(!engagementEndpoint)throw Error('unavailable');
  const url=new URL(engagementEndpoint);url.searchParams.set('article',article);url.searchParams.set('_',String(Date.now()));if(visitor())url.searchParams.set('visitor',visitor());
  const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(45000)}),data=await response.json();if(!data.ok)throw Error('unavailable');return data;
}
export function errorText(error){return error.message==='rate_limit'?'操作有點頻繁，請稍後再試。':error.message==='invalid'?'請檢查欄位內容，再試一次。':'目前連線不順，尚未確認完成。內容已保留，請稍後重試。';}
