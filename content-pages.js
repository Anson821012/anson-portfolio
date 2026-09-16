'use strict';
// Content is present in HTML; these enhancements only help people browse it.
const catalogueInput = document.querySelector('#catalogue-filter');
const contentMedia = matchMedia('(max-width:800px)');
function setMobileFolds() { document.querySelectorAll('.mobile-fold').forEach(el=>{el.open=!contentMedia.matches;}); }
setMobileFolds();
contentMedia.addEventListener('change',setMobileFolds);
if(catalogueInput) {
  const categories=[...document.querySelectorAll('[data-searchable]')];
  let previousOpen=null;
  catalogueInput.addEventListener('input',()=>{
    const terms=catalogueInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if(terms.length && !previousOpen) previousOpen=new Set(categories.filter(d=>d.open));
    let count=0;
    categories.forEach(detail=>{
      const matched=terms.every(term=>detail.textContent.toLocaleLowerCase().includes(term));
      detail.hidden=!matched;
      if(matched) count++;
      detail.open=terms.length ? matched : !!previousOpen?.has(detail);
    });
    document.querySelectorAll('.catalogue-facet').forEach(section=>{section.hidden=![...section.querySelectorAll('[data-searchable]')].some(d=>!d.hidden);});
    document.querySelector('#catalogue-status').textContent=terms.length ? (count?`找到 ${count} 種相關困擾；展開內容已顯示。`:'這個詞還沒找到對應內容。可以換一個詞，或直接和 Anson 聊聊。') : '';
    if(!terms.length) previousOpen=null;
  });
}
function revealTarget() {
  let target;
  try { target=document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  if(!target)return;
  for(let el=target.parentElement;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;
  target.scrollIntoView({block:'start'});
}
window.addEventListener('hashchange',revealTarget);
window.addEventListener('load',revealTarget,{once:true});
