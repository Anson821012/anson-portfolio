'use strict';
const catalogueInput=document.querySelector('#catalogue-filter');
const facetSelect=document.querySelector('#facet-select');
const contentMedia=matchMedia('(max-width:800px)');
function setMobileFolds(){document.querySelectorAll('.mobile-fold').forEach(el=>{el.open=!contentMedia.matches;});}
setMobileFolds();contentMedia.addEventListener('change',setMobileFolds);
function filterCatalogue(updateURL=false){
  if(!catalogueInput)return;
  const terms=catalogueInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let count=0;
  document.querySelectorAll('.catalogue-facet').forEach(facet=>{
    const active=facetSelect.value==='all'||facet.dataset.facet===facetSelect.value;
    facet.querySelectorAll('[data-searchable]').forEach(detail=>{
      let matches=0;
      detail.querySelectorAll('.catalogue-item').forEach(item=>{
        const text=(detail.querySelector('summary').textContent+' '+item.textContent).toLocaleLowerCase();
        const match=active&&terms.every(term=>text.includes(term));
        item.hidden=!match;if(match){matches++;count++;}
      });
      detail.hidden=matches===0;
      if(terms.length)detail.open=matches>0;
    });
    facet.hidden=![...facet.querySelectorAll('[data-searchable]')].some(d=>!d.hidden);
  });
  document.querySelector('#catalogue-status').textContent=count?`找到 ${count} 項服務；點開困擾分類查看。`:'暫時沒有符合的服務。試試其他關鍵字，或直接到合作詢問聊聊。';
  if(updateURL){const url=new URL(location.href);url.searchParams.delete('list');url.searchParams.set('facet',facetSelect.value);if(catalogueInput.value.trim())url.searchParams.set('q',catalogueInput.value.trim());else url.searchParams.delete('q');url.hash='all-services';history.replaceState(null,'',url);}
}
function restoreFilters(){if(!catalogueInput)return;const q=new URLSearchParams(location.search);catalogueInput.value=q.get('q')||'';facetSelect.value=[...facetSelect.options].some(o=>o.value===q.get('facet'))?q.get('facet'):'start';filterCatalogue();}
if(catalogueInput){restoreFilters();catalogueInput.addEventListener('input',()=>{if(catalogueInput.value.trim())facetSelect.value='all';filterCatalogue(true);});facetSelect.addEventListener('change',()=>{document.querySelectorAll('[data-searchable]').forEach(d=>d.open=false);filterCatalogue(true);});}
function revealTarget(){let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}if(!target)return;if(target.matches('.catalogue-item')){facetSelect.value=target.closest('[data-facet]').dataset.facet;catalogueInput.value='';filterCatalogue();}for(let el=target.parentElement;el;el=el.parentElement)if(el.tagName==='DETAILS')el.open=true;target.scrollIntoView({block:'start'});}
window.addEventListener('hashchange',revealTarget);window.addEventListener('load',revealTarget,{once:true});window.addEventListener('popstate',()=>{restoreFilters();revealTarget();});
