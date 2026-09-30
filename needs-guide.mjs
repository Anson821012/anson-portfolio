import {questions, recommend, answerLabels} from './needs-guide-state.mjs';

function init() {
  const launch=document.querySelector('[data-open-guide]');
  const dialog=document.querySelector('#needs-guide');
  if (!launch || !dialog || typeof serviceData==='undefined' || !document.documentElement.hasAttribute('data-selection-ready')) return;
  const catalogue=serviceData.categories.flatMap(c=>c.services);
  const cases=typeof portfolioCases==='undefined' ? [] : portfolioCases;
  const content=dialog.querySelector('[data-guide-content]');
  const footer=dialog.querySelector('[data-guide-footer]');
  const steps=dialog.querySelectorAll('[data-guide-step]');
  const message=dialog.querySelector('[data-guide-message]');
  let step=0, answers={}, savedIds=[], canPersist=true, request=0, awaiting=null;
  let opener, latestResult, openListOnClose=false;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
  function action(label,cls,handler) { const b=node('button',label,cls);b.type='button';b.addEventListener('click',handler);return b; }
  function link(label,href,cls) { const a=node('a',label,cls);a.href=href;return a; }
  function robotState(state) { document.dispatchEvent(new CustomEvent('office:guide-state',{detail:{state}})); }
  function focusHeading() { content.querySelector('h3')?.focus({preventScroll:true}); content.scrollTop=0; }
  function progress() {
    steps.forEach((el,i)=>{el.dataset.done=String(i<step);if(i===Math.min(step,2))el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    dialog.dataset.step=String(step);
  }
  function showQuestion(focus=true) {
    latestResult=null; awaiting=null; content.replaceChildren();footer.replaceChildren();message.textContent='';progress();
    const question=questions[step];
    content.append(node('p',`先看${['困擾','做法','期待'][step]} · ${step+1} / 3`,'ng-eyebrow'));
    const h=node('h3',question.title);h.id='guide-question';h.tabIndex=-1;content.append(h,node('p',question.hint,'ng-hint'));
    const fieldset=node('fieldset',null,'ng-options');fieldset.setAttribute('aria-labelledby',h.id);
    const legend=node('legend',question.title,'visually-hidden');fieldset.append(legend);
    for(const option of question.options) {
      const label=node('label',null,'ng-choice');
      const input=node('input');input.type='radio';input.name='guide-'+question.id;input.value=option.id;input.checked=answers[question.id]===option.id;
      input.addEventListener('change',()=>{answers[question.id]=option.id;next.disabled=false;});
      const text=node('span',null,'ng-choice-text');text.append(node('strong',option.label),node('span',option.detail));
      label.append(input,text);fieldset.append(label);
    }
    content.append(fieldset);
    const prev=action('← 上一題','ng-back',()=>{step--;showQuestion();});prev.disabled=step===0;footer.append(prev);
    const next=action(step===2 ? '看看整理方向 →' : '下一題 →','ng-primary',()=>{
      if(!question.options.some(o=>o.id===answers[question.id]))return;
      step++;step===3 ? showResult() : showQuestion();
    });next.disabled=!answers[question.id];footer.append(next);
    if(focus)focusHeading();
  }
  function showResult() {
    latestResult=recommend(answers,catalogue);
    if(!latestResult){step=0;showQuestion();return;}
    content.replaceChildren();footer.replaceChildren();message.textContent='';progress();
    content.append(node('p','你的整理起點 · 先做一小步','ng-eyebrow'));
    const h=node('h3',latestResult.title);h.id='guide-question';h.tabIndex=-1;content.append(h);
    content.append(node('p','這是依你的選擇整理出的討論方向，實際範圍與費用，再和 Anson 一起確認。','ng-hint'));
    const summary=node('details',null,'ng-answer-summary');summary.append(node('summary','你剛才選了這些'));
    const labels=answerLabels(answers);const list=node('ul');labels.forEach((v,i)=>list.append(node('li',`${['想處理','目前做法','希望先做到'][i]}：${v}`)));summary.append(list);content.append(summary);
    const smallStep=node('div',null,'ng-small-step');smallStep.append(node('span','可以先試的第一步'),node('p',latestResult.step));content.append(smallStep);
    const fieldset=node('fieldset',null,'ng-recommendations');fieldset.append(node('legend','想聊的服務，可以只勾一項。'));
    for(const service of latestResult.services) {
      const card=node('article',null,'ng-service');
      const label=node('label'); const input=node('input');input.type='checkbox';input.name='guide-service';input.value=service.id;input.checked=true;
      const name=node('strong',service.name);label.append(input,name);card.append(label,node('p',service.reason,'ng-reason'),node('p',`會一起整理：${service.delivery}`,'ng-delivery'));
      card.append(link('看完整服務 ↗',`services/#${service.id}`,'ng-inline-link'));fieldset.append(card);
    }
    content.append(fieldset);
    const related=cases.find(c=>c.id===latestResult.caseId);
    if(related) {
      const story=node('details',null,'ng-case');
      const title=node('summary');title.append(node('span','看看真實作品怎麼整理'),node('strong',related.title));story.append(title);
      story.append(node('p',latestResult.connection));
      const timeline=node('ol',null,'ng-case-steps');
      [['原本的麻煩',related.problem],['看見的問題',related.insight],['做了哪些整理',related.action],['整理之後',related.after]].forEach(([label,text])=>{const item=node('li');item.append(node('strong',label),node('p',text));timeline.append(item);});
      story.append(timeline,link('閱讀完整作品與實作範圍 ↗',`cases/${related.id}/`,'ng-inline-link'));content.append(story);
    }
    const tools=node('div',null,'ng-result-tools');tools.append(action('複製這次的整理方向','ng-text-button',async()=>{
      const text=latestResult.summary+'\n\n想了解的服務：\n'+getChecked().map(id=>catalogue.find(s=>s.id===id)?.name).filter(Boolean).map(n=>'・'+n).join('\n');
      try {await navigator.clipboard.writeText(text);message.textContent='已複製，可以貼到詢問備註裡。';}
      catch {const area=node('textarea');area.readOnly=true;area.value=text;area.setAttribute('aria-label','可手動複製的整理方向');tools.append(area);area.focus();area.select();message.textContent='請複製已選取的文字。';}
    }));content.append(tools);
    footer.append(action('← 修改答案','ng-back',()=>{step=2;showQuestion();}));
    const add=action('加入我的簡化清單 ＋','ng-primary',()=>{
      const ids=getChecked();if(!ids.length||awaiting)return;
      awaiting=++request;add.disabled=true;add.textContent='正在放進清單…';
      document.dispatchEvent(new CustomEvent('office:guide-add',{detail:{ids,request:awaiting}}));
    });add.dataset.guideAdd='';footer.append(add);
    const onward=node('div',null,'ng-onward');onward.hidden=true;onward.dataset.guideOnward='';
    onward.append(link('帶著清單，找 Anson 聊聊 →','contact/','ng-primary'),action('先看看我的清單','ng-back',()=>{
      openListOnClose=true;dialog.close();
    }));content.append(onward);
    fieldset.addEventListener('change',refreshSelection);
    refreshSelection();focusHeading();robotState('result');
  }
  function getChecked() {return [...content.querySelectorAll('input[name="guide-service"]:checked')].map(i=>i.value);}
  function refreshSelection() {
    const add=footer.querySelector('[data-guide-add]');if(!add)return;
    const ids=getChecked(), allAdded=ids.length>0&&ids.every(id=>savedIds.includes(id));
    add.disabled=!ids.length||allAdded||awaiting!==null;
    add.textContent=awaiting!==null ? '正在放進清單…' : allAdded ? '已在簡化清單裡 ✓' : !ids.length ? '先勾選想聊的項目' : `加入 ${ids.length} 項到簡化清單 ＋`;
    const onward=content.querySelector('[data-guide-onward]');onward.hidden=!allAdded;
    onward.querySelector('a').hidden=!canPersist;
  }
  document.addEventListener('office:list-changed',event=>{savedIds=event.detail.ids;canPersist=event.detail.persisted;refreshSelection();});
  document.addEventListener('office:guide-added',event=>{
    if(event.detail.request!==awaiting)return;
    awaiting=null;
    if(event.detail.ok){savedIds=event.detail.ids;canPersist=event.detail.persisted;message.textContent=canPersist ? '已放進你的簡化清單。還沒送出，也還不用決定。' : '已放進本頁清單；這個瀏覽器無法保存，請先開啟清單複製內容。';robotState('added');}
    else message.textContent='這次沒有加進去，請再試一次。';
    refreshSelection();
    if(event.detail.ok)content.querySelector('[data-guide-onward]')?.scrollIntoView({block:'nearest',behavior:'auto'});
  });
  launch.hidden=false;
  document.querySelector('.robot-guide').hidden=true;
  document.querySelector('.robot-footnote').textContent='三個小問題，找到適合你的整理起點。';
  launch.addEventListener('click',()=>{
    opener=document.activeElement;document.dispatchEvent(new Event('office:guide-read-list'));
    step===3 ? showResult() : showQuestion(false);dialog.showModal();document.body.classList.add('guide-open');focusHeading();robotState('open');
  });
  dialog.querySelector('[data-guide-close]').addEventListener('click',()=>dialog.close());
  dialog.querySelector('[data-guide-restart]').addEventListener('click',()=>{answers={};step=0;showQuestion();});
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('guide-open');robotState('close');
    if(openListOnClose){openListOnClose=false;document.dispatchEvent(new CustomEvent('office:guide-open-list',{detail:{opener:launch}}));}
    else opener?.focus({preventScroll:true});
  });
  document.dispatchEvent(new Event('office:guide-read-list'));
}
// Module execution can happen while deferred catalogue/app scripts are still loading.
if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
