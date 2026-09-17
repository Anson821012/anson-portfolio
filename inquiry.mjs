import {request,errorText} from './engagement-api.mjs';
import {track} from './analytics.mjs';
import {storageKey,readSelection,inquirySummary} from './consultation-state.mjs';
const form=document.querySelector('#website-inquiry');
const attributionKey='less-trouble-office:entry';
let entry={entry:location.pathname,referrer:'direct'};
try{entry.referrer=new URL(document.referrer).hostname||'direct';}catch{}
try{const saved=sessionStorage.getItem(attributionKey);if(saved)entry=JSON.parse(saved);else sessionStorage.setItem(attributionKey,JSON.stringify(entry));}catch{}
if(form){
  const status=document.querySelector('#website-inquiry-status'),button=form.querySelector('[type=submit]');
  let requestId=crypto.randomUUID(), started=false;
  form.addEventListener('input',()=>{if(!started){track('inquiry_start');started=true;}});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity()||button.disabled)return;
    button.disabled=true;status.textContent='正在送出，請稍候…';
    const fields=new FormData(form),catalogue=JSON.parse(document.querySelector('#selection-catalogue').textContent);
    let storage;try{storage=localStorage;}catch{}
    const summary=inquirySummary(readSelection(storage,catalogue),catalogue,document.querySelector('#contact-offer')?.selectedOptions[0]?.textContent||'');
    try{
      const data=await request({action:'lead',request:requestId,name:fields.get('name'),email:fields.get('email'),message:fields.get('message'),website:fields.get('website'),services:summary,page:location.pathname,...entry});
      if(data.action!=='lead'||data.request!==requestId)throw Error('unavailable');
      if(!data.duplicate)track('generate_lead',{method:'website_form'});
      form.reset();status.textContent='已收到你的詢問，謝謝你把現在的狀況告訴我。我會閱讀後，透過你留下的 Email 聯絡你，一起確認下一步。— Anson';
      requestId=crypto.randomUUID();started=false;status.focus();
    }catch(error){status.textContent=errorText(error)+' 也可以改用下方 Email 聯絡我。';}
    finally{button.disabled=false;}
  });
}
