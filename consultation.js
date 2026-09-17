import {storageKey,readSelection,inquirySummary,formPreparation} from './consultation-state.mjs';
const catalogue=JSON.parse(document.querySelector('#selection-catalogue')?.textContent||'[]');
let storage;
try {storage=window.localStorage;} catch {}
let state=readSelection(storage,catalogue);
const dialog=document.querySelector('#selection-dialog');
const note=document.querySelector('#selection-note');
const offer=document.querySelector('#contact-offer');
const frame=document.querySelector('#inquiry-frame');
const openForm=document.querySelector('#open-inquiry');
let opener;
let frozen=false;
let storageAvailable=!!storage;
function save() {
  try {if(!storage)throw Error();storage.setItem(storageKey,JSON.stringify(state));}catch {storageAvailable=false;}
  document.querySelector('#selection-storage').textContent=storageAvailable?'只儲存在這個瀏覽器，尚未傳送給 Anson。':'瀏覽器無法儲存。請先複製備註，並在本頁開啟表單帶入清單；離開頁面可能遺失。';
}
function summary() {return inquirySummary(state,catalogue,offer?.selectedOptions[0]?.textContent||'');}
function render() {
  document.querySelectorAll('.selection-count').forEach(e=>e.textContent=state.ids.length);
  document.querySelectorAll('[data-add-service]').forEach(button=>{
    const selected=state.ids.includes(button.dataset.addService);
    button.setAttribute('aria-pressed',String(selected));
    button.textContent=selected?'已加入，點此移除 ✓':'加入我的簡化清單 ＋';
  });
  const items=document.querySelector('#selection-items');
  items.replaceChildren();
  if(!state.ids.length){const li=document.createElement('li');li.textContent='還沒選服務也沒關係，直接寫下想聊的事。';items.append(li);}
  state.ids.forEach(id=>{
    const li=document.createElement('li');const text=document.createElement('span');text.textContent=catalogue.find(s=>s.id===id).name;
    const remove=document.createElement('button');remove.type='button';remove.className='selection-remove';remove.dataset.removeService=id;remove.textContent='移除';remove.setAttribute('aria-label',`移除${text.textContent}`);li.append(text,remove);items.append(li);
  });
  const contactItems=document.querySelector('#contact-selection');
  if(contactItems){contactItems.replaceChildren();(state.ids.length?state.ids.map(id=>catalogue.find(s=>s.id===id).name):['尚未選定服務，先聊聊也可以。']).forEach(name=>{const li=document.createElement('li');li.textContent=name;contactItems.append(li);});}
  if(openForm&&!frozen){const prepared=formPreparation(summary());openForm.href=prepared.url;document.querySelector('#long-inquiry').hidden=!prepared.needsPaste;document.querySelector('#full-inquiry').value=prepared.summary;}
  if(frame&&!frame.hidden)document.querySelector('#inquiry-status').textContent='表單已載入。若剛才修改了清單，請在表單內同步修改「服務清單與補充」，避免重新載入清除已填內容。';
}
function show(){opener=document.activeElement;note.value=state.note;render();dialog.showModal();}
function close(){dialog.close();}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add-service]');
  if(add){const id=add.dataset.addService;state.ids=state.ids.includes(id)?state.ids.filter(x=>x!==id):[...state.ids,id];save();render();document.querySelector('#selection-status').textContent=`簡化清單目前有 ${state.ids.length} 項。`;}
  if(event.target.closest('[data-open-selection]')){event.preventDefault();show();}
  if(event.target.closest('[data-close-selection]'))close();
  const remove=event.target.closest('[data-remove-service]');
  if(remove){state.ids=state.ids.filter(id=>id!==remove.dataset.removeService);save();render();dialog.querySelector('[data-remove-service],#selection-note').focus();}
  if(event.target.closest('[data-print-profile]'))window.print();
  if(event.target.closest('[data-selection-contact]')&&frame){event.preventDefault();close();document.querySelector('#load-inquiry').focus();}
});
dialog.addEventListener('close',()=>opener?.focus());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
note.addEventListener('input',()=>{state.note=note.value.slice(0,2000);save();render();});
window.addEventListener('storage',event=>{if(event.key===storageKey){state=readSelection(storage,catalogue);note.value=state.note;render();}});
window.addEventListener('pageshow',()=>{state=storageAvailable?readSelection(storage,catalogue):state;render();});
if(offer){const requested=new URLSearchParams(location.search).get('offer');if([...offer.options].some(o=>o.value===requested))offer.value=requested;offer.addEventListener('change',render);}
document.querySelector('#load-inquiry')?.addEventListener('click',event=>{
  if(frozen)return;
  const prepared=formPreparation(summary());frame.src=prepared.embeddedURL;frame.hidden=false;openForm.href=prepared.url;frozen=true;
  event.target.disabled=true;event.target.textContent='表單已載入';
  document.querySelector('#inquiry-status').textContent='下方正在載入 Google 表單。若一直沒有出現，請使用「另開 Google 表單填寫」。';
  frame.addEventListener('load',()=>{document.querySelector('#inquiry-status').textContent='請在下方 Google 表單內填寫並提交。完成後，以表單顯示的確認訊息為準。';},{once:true});
});
document.querySelector('#copy-inquiry')?.addEventListener('click',async()=>{const text=document.querySelector('#full-inquiry');try{await navigator.clipboard.writeText(text.value);document.querySelector('#copy-status').textContent='已複製，請貼進 Google 表單的「服務清單與補充」。';}catch{text.focus();text.select();document.querySelector('#copy-status').textContent='請長按或使用鍵盤複製已選取的完整內容。';}});
render();save();
if(new URLSearchParams(location.search).get('list')==='open')show();
