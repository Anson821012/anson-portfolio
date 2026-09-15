'use strict';
const { categories, facets, legacyIds } = serviceData;
const caseById = new Map(portfolioCases.map(item => [item.id, item]));
const catalogue = categories.flatMap((category, categoryIndex) => category.services.map((item, index) => ({
  ...item, code: `${String(categoryIndex + 1).padStart(2, '0')}.${index + 1}`,
  category: category.name, categoryIndex, facet: category.facet
})));
const byId = new Map(catalogue.map(service => [service.id, service]));
const storageKey = 'less-trouble-office:list:v2';
let selected = new Set();
let note = '';
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || localStorage.getItem('less-trouble-office:list:v1') || '{}');
  if (Array.isArray(saved.ids)) selected = new Set(saved.ids.map(id => legacyIds[id] || id).filter(id => byId.has(id)));
  if (typeof saved.note === 'string') note = saved.note.slice(0, 2000);
} catch { storageAvailable = false; }

let activeCategory = 0;
let lastTrigger;
let toastTimer;
const dialog = document.querySelector('#list-dialog');
const toast = document.querySelector('#toast');
const noteInput = document.querySelector('#trouble-note');
noteInput.value = note;

function storageMessage() {
  document.querySelector('#storage-note').textContent = storageAvailable
    ? '清單會保存在這個瀏覽器，尚未傳送給 Anson。'
    : '此瀏覽器無法保存清單；離開前請複製。內容尚未傳送給 Anson。';
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ ids: [...selected], note })); }
  catch { storageAvailable = false; }
  storageMessage();
}
function announce(message) {
  clearTimeout(toastTimer);
  (dialog.open ? dialog : document.body).append(toast);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}
function updateSelection() {
  document.querySelectorAll('.list-count').forEach(el => {
    el.textContent = selected.size;
    el.classList.remove('bump');
    requestAnimationFrame(() => el.classList.add('bump'));
  });
  document.querySelectorAll('[data-service-id]').forEach(button => {
    const added = selected.has(button.dataset.serviceId);
    button.setAttribute('aria-pressed', String(added));
    button.querySelector('.add-label').textContent = added ? '已加入簡化清單' : '加入我的簡化清單';
    button.querySelector('.add-symbol').textContent = added ? '✓' : '＋';
    button.setAttribute('aria-label', `${added ? '從清單移除' : '加入清單'}：${byId.get(button.dataset.serviceId).name}`);
  });
  document.querySelectorAll('[data-open-list]').forEach(button => {
    button.setAttribute('aria-label', `開啟我的簡化清單，已選 ${selected.size} 項服務`);
  });
  renderList();
  document.querySelector('#plain-list').hidden = true;
}
let activeFacet = 'start';
let searchQuery = '';
const tabs = document.querySelector('#categories');
const searchInput = document.querySelector('#service-search');
const clearSearch = document.querySelector('#clear-search');
const facetContainer = document.querySelector('#facets');
function visibleCategories() {
  return categories.map((category, index) => ({ category, index })).filter(({category}) => activeFacet === 'all' || category.facet === activeFacet);
}
function renderFacets() {
  facetContainer.innerHTML = [{id:'all',name:'全部面向'}, ...facets].map(facet => `<button type="button" data-facet="${facet.id}" aria-pressed="${facet.id === activeFacet}">${facet.name}</button>`).join('');
}
function renderTabs() {
  tabs.innerHTML = visibleCategories().map(({category,index}) => `<button class="category-button" role="tab" id="category-${index}" aria-controls="service-panel" aria-selected="${index === activeCategory && !searchQuery}" tabindex="${index === activeCategory ? 0 : -1}" data-category="${index}"><span class="cat-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${category.name}</span><span class="cat-arrow" aria-hidden="true">↗</span></button>`).join('');
}
function renderCards(services) {
  document.querySelector('#service-cards').innerHTML = services.length ? services.map(service => {
    const related = caseById.get(service.caseId);
    return `<article class="service-card">
      <div class="service-title-line"><h4><span class="service-code">整理項目 ${service.code}${searchQuery ? ` · ${service.category}` : ''}</span>${service.name}</h4><button class="service-add" data-service-id="${service.id}" aria-pressed="false"><span class="add-label">加入我的簡化清單</span><span class="add-symbol" aria-hidden="true">＋</span></button></div>
      <p class="service-solution">${service.solution}</p>
      <dl class="service-details"><div><dt>適合的狀況</dt><dd>${service.fit}</dd></div><div><dt>最後會拿到</dt><dd>${service.delivery}</dd></div><div><dt>預計時間</dt><dd>盤點後確認時程</dd></div></dl>
      <div class="service-bottom"><span class="service-price">依範圍報價</span>${related ? `<a class="service-case" href="#case-${related.id}" data-show-case="${related.id}">相關實作：${related.title} ↗</a>` : '<span class="service-case-note">可討論需求 · 尚未列公開實作</span>'}</div>
    </article>`;
  }).join('') : '<div class="search-empty"><span aria-hidden="true">⌕</span><h4>這個詞，還沒找到對應的項目。</h4><p>試試「活動」「交接」「文案」，或直接把你的狀況寫進簡化清單。</p><button class="button secondary" id="reset-results">看看全部服務</button></div>';
  updateSelection();
}
function renderCategory(index, moveFocus = false) {
  activeCategory = index;
  searchQuery = ''; searchInput.value = ''; clearSearch.hidden = true;
  tabs.querySelectorAll('[role=tab]').forEach(tab => {
    const active = Number(tab.dataset.category) === index;
    tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
  });
  const category = categories[index];
  document.querySelector('#category-caption').textContent = category.caption;
  document.querySelector('#category-title').textContent = category.name;
  document.querySelector('#category-description').textContent = category.description;
  document.querySelector('#service-total').textContent = `${category.services.length} 項整理服務`;
  const panel = document.querySelector('#service-panel');
  panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', `category-${index}`);
  renderCards(catalogue.filter(service => service.categoryIndex === index));
  if (moveFocus) document.querySelector(`#category-${index}`).focus({ preventScroll: true });
}
function renderSearch() {
  const terms = searchQuery.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const services = catalogue.filter(service => {
    const facet = facets.find(item => item.id === service.facet);
    const haystack = [service.name,service.solution,service.fit,service.delivery,service.category,facet.name,service.name.includes('SOP') ? '標準作業流程' : ''].join(' ').toLocaleLowerCase();
    return (activeFacet === 'all' || service.facet === activeFacet) && terms.every(term => haystack.includes(term));
  });
  renderTabs();
  document.querySelector('#category-caption').textContent = activeFacet === 'all' ? '在完整服務地圖中找一找。' : `在「${facets.find(item => item.id === activeFacet).name}」中找一找。`;
  document.querySelector('#category-title').textContent = `關於「${searchQuery}」`;
  document.querySelector('#category-description').textContent = '搜尋服務名稱、困擾情境與交付內容；找到適合的，就先放進清單。';
  document.querySelector('#service-total').textContent = `找到 ${services.length} 項整理服務`;
  const panel = document.querySelector('#service-panel');
  panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', 'category-title');
  renderCards(services);
}
function resetResults() {
  activeFacet = 'all'; activeCategory = 0;
  renderFacets(); renderTabs(); renderCategory(0);
  searchInput.focus();
}
facetContainer.addEventListener('click', event => {
  const button = event.target.closest('[data-facet]'); if (!button) return;
  activeFacet = button.dataset.facet;
  activeCategory = visibleCategories()[0].index;
  renderFacets(); renderTabs();
  if (searchQuery) renderSearch(); else renderCategory(activeCategory);
  facetContainer.querySelector(`[data-facet="${activeFacet}"]`).focus({preventScroll:true});
});
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  clearSearch.hidden = !searchQuery;
  activeFacet = 'all'; renderFacets();
  if (searchQuery) renderSearch(); else { renderTabs(); renderCategory(activeCategory); }
});
clearSearch.addEventListener('click', () => {renderCategory(activeCategory); searchInput.focus();});
tabs.addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (button) renderCategory(Number(button.dataset.category));
});
tabs.addEventListener('keydown', event => {
  const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const indices = visibleCategories().map(item => item.index);
  let position = Math.max(0, indices.indexOf(activeCategory));
  if (['ArrowDown','ArrowRight'].includes(event.key)) position = (position + 1) % indices.length;
  if (['ArrowUp','ArrowLeft'].includes(event.key)) position = (position - 1 + indices.length) % indices.length;
  if (event.key === 'Home') position = 0;
  if (event.key === 'End') position = indices.length - 1;
  renderCategory(indices[position], true);
  document.querySelector(`#category-${activeCategory}`).scrollIntoView({block:'nearest',inline:'nearest'});
});
document.querySelector('#catalogue-summary').textContent = `${facets.length} 個面向 / ${categories.length} 種困擾 / ${catalogue.length} 項可討論的服務`;
renderFacets(); renderTabs();
const railMedia = matchMedia('(max-width:800px)');
function updateOrientation() { tabs.setAttribute('aria-orientation', railMedia.matches ? 'horizontal' : 'vertical'); }
railMedia.addEventListener('change', updateOrientation);
updateOrientation();
document.querySelector('#service-cards').addEventListener('click', event => {
  const button = event.target.closest('[data-service-id]');
  if (event.target.closest('#reset-results')) { resetResults(); return; }
  if (!button) return;
  const id = button.dataset.serviceId;
  const removed = selected.delete(id);
  if (!removed) selected.add(id);
  save(); updateSelection();
  if (!removed) deliverCard(button);
  announce(`${removed ? '已移除' : '已加入'}：${byId.get(id).name}`);
});
function deliverCard(button) {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches || !Element.prototype.animate) return;
  const start = button.getBoundingClientRect();
  const end = document.querySelector('[data-open-list]').getBoundingClientRect();
  const helper = document.createElement('div');
  helper.className = 'delivery-helper'; helper.setAttribute('aria-hidden', 'true');
  helper.innerHTML = '<svg viewBox="0 0 65 76" fill="none" stroke="#344037" stroke-width="2.3" stroke-linejoin="round"><path d="M15 39h32l5 24-39-2Z" fill="#c6d39f"/><path d="m22 61-2 12m24-12 3 12M30 13V5"/><circle cx="30" cy="5" r="3" fill="#df744b"/><rect x="8" y="13" width="46" height="31" rx="9" fill="#dfe7be"/><circle cx="22" cy="27" r="2" fill="#344037"/><circle cx="40" cy="27" r="2" fill="#344037"/><path d="M26 35q5 5 10 0"/><path d="m35 47 24-5 4 26-24 4Z" fill="#fffdf7"/><path d="m43 55 12-2m-11 8 10-2"/></svg>';
  helper.style.left = `${start.left + start.width / 2 - 25}px`;
  helper.style.top = `${start.top}px`;
  document.body.append(helper);
  const x = end.left + end.width / 2 - start.left - start.width / 2;
  const y = end.top + end.height / 2 - start.top;
  const animation = helper.animate([
    { transform: 'translate(0,0) rotate(-8deg) scale(.8)', opacity: 0 },
    { transform: `translate(${x * .18}px,${y * .18}px) rotate(7deg) scale(1)`, opacity: 1, offset: .25 },
    { transform: `translate(${x}px,${y}px) rotate(-5deg) scale(.35)`, opacity: 0 }
  ], { duration: 900, easing: 'cubic-bezier(.25,.65,.4,1)' });
  animation.onfinish = () => helper.remove();
  animation.oncancel = () => helper.remove();
}
function renderList() {
  const list = document.querySelector('#selected-services');
  list.replaceChildren();
  [...selected].forEach(id => {
    const service = byId.get(id);
    const li = document.createElement('li');
    const info = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = service.name;
    const meta = document.createElement('small'); meta.textContent = `${service.category} · 依範圍報價`;
    info.append(title, meta);
    const remove = document.createElement('button'); remove.className = 'remove-service'; remove.textContent = '移除';
    remove.setAttribute('aria-label', `移除：${service.name}`);
    remove.addEventListener('click', () => {
      const index = [...selected].indexOf(id);
      selected.delete(id); save(); updateSelection();
      const remaining = list.querySelectorAll('button');
      (remaining[Math.min(index, remaining.length - 1)] || noteInput).focus();
      announce(`已移除：${service.name}`);
    });
    li.append(info, remove); list.append(li);
  });
  document.querySelector('#empty-list').hidden = selected.size > 0;
}
function openList(trigger) {
  lastTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  document.querySelector('#close-list').focus();
}
document.querySelectorAll('[data-open-list]').forEach(button => button.addEventListener('click', () => openList(button)));
document.querySelector('#close-list').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  toast.classList.remove('visible'); document.body.append(toast);
  if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
});
let backdropDown = false;
dialog.addEventListener('pointerdown', event => {
  const rect = dialog.getBoundingClientRect();
  backdropDown = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (backdropDown && outside) dialog.close();
  backdropDown = false;
});
document.querySelector('#browse-services').addEventListener('click', () => {
  dialog.close();
  document.querySelector('#services').scrollIntoView();
  document.querySelector(`#category-${activeCategory}`).focus({ preventScroll: true });
});
noteInput.addEventListener('input', () => { note = noteInput.value; save(); document.querySelector('#plain-list').hidden = true; });
function consultationText() {
  if (!selected.size && !note.trim()) return '';
  const lines = ['Anson 你好，我想聊聊這些麻煩：', ''];
  [...selected].forEach((id, index) => {
    const service = byId.get(id);
    lines.push(`${index + 1}. ${service.name}（${service.category}）`);
  });
  if (note.trim()) lines.push('', '我的狀況：', note.trim());
  lines.push('', '想先一起確認需求、範圍、費用與時程。');
  return lines.join('\n');
}
function legacyCopy(text) {
  const temp = document.createElement('textarea');
  temp.value = text; temp.setAttribute('aria-label', '待複製的諮詢內容');
  temp.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none';
  dialog.append(temp); temp.focus(); temp.select();
  let success = false;
  try { success = document.execCommand('copy'); } catch { /* Offer selectable text if copying is blocked. */ }
  temp.remove(); document.querySelector('#copy-list').focus();
  return success;
}
document.querySelector('#copy-list').addEventListener('click', async () => {
  const text = consultationText();
  if (!text) { announce('先挑選服務，或寫下你想整理的麻煩。'); noteInput.focus(); return; }
  let copied = false;
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); copied = true; } } catch { /* Try the local copy path below. */ }
  if (!copied) copied = legacyCopy(text);
  announce(copied ? '已複製。開啟 LINE 後，貼上內容即可。' : '瀏覽器未允許複製，請展開「查看文字清單」手動複製。');
});
function showPlainList() {
  const text = consultationText();
  if (!text) { announce('先挑選服務，或寫下你想整理的麻煩。'); noteInput.focus(); return; }
  const area = document.querySelector('#plain-list-text');
  document.querySelector('#plain-list').hidden = false;
  area.value = text;
  area.focus(); area.select();
}
document.querySelector('#view-list').addEventListener('click', showPlainList);

storageMessage();
renderCategory(0);


const caseFilters = [{id:'all',name:'全部作品'},{id:'customer',name:'顧客與服務'},{id:'operations',name:'營運與團隊'},{id:'brand',name:'品牌與內容'},{id:'life',name:'生活與情感'}];
let activeCaseFilter = 'all';
function renderPortfolio() {
  document.querySelector('#case-filters').innerHTML = caseFilters.map(filter => `<button type="button" data-case-filter="${filter.id}" aria-pressed="${filter.id === activeCaseFilter}">${filter.name}</button>`).join('');
  document.querySelector('#portfolio-grid').innerHTML = portfolioCases.filter(item => activeCaseFilter === 'all' || item.group === activeCaseFilter).map((item) => {
    const index = portfolioCases.indexOf(item);
    const related = catalogue.filter(service => service.caseId === item.id).slice(0,3);
    return `<article class="portfolio-card tone-${index % 4}" id="case-${item.id}">
    <div class="work-visual"><div class="work-topline"><span>整理筆記 / ${String(index+1).padStart(2,'0')}</span><span>流程示意</span></div><p class="work-headline">${item.headline.replace(/\n/g,'<br>')}</p><div class="work-flow">${item.flow.map((step,i) => `<div><span>${String(i+1).padStart(2,'0')}</span><strong>${step}</strong></div>`).join('')}</div><span class="work-stamp" aria-hidden="true">一件一件<br>整理好 ✓</span></div>
    <div class="work-copy"><p class="eyebrow">${item.kicker}</p><h3>${item.title}</h3><p class="work-summary">${item.summary}</p><div class="work-tags">${item.tags.map(tag=>`<span>${tag}</span>`).join('')}</div><div class="work-care"><span>多想的那一步</span><p>${item.care}</p></div>
    <details class="work-detail"><summary>展開動機、做法與品牌價值 <span aria-hidden="true">＋</span></summary><div class="work-detail-body"><ol class="work-story"><li><strong>01 / 原本的麻煩</strong><p>${item.problem}</p></li><li><strong>02 / 看見的問題</strong><p>${item.insight}</p></li><li><strong>03 / 做了什麼整理</strong><p>${item.action}</p></li><li><strong>04 / 整理後的工作方式</strong><p>${item.after}</p></li></ol><section class="motive-block"><h4>從設計讀出的動機</h4><p>${item.motive}</p></section><section class="benefit-block"><h4>可以為品牌帶來什麼？</h4><p>${item.benefit}</p></section><h4 class="feature-heading">實際作品中的功能／交付</h4><ul class="verified-features">${item.features.map(feature=>`<li>${feature}</li>`).join('')}</ul>${item.id === 'content' ? '<a class="text-link" href="#growth">查看福韻成長與公開署名 ↗</a>' : ''}${item.id === 'quiz' ? '<a class="text-link" href="https://anson821012.github.io/didactic-carnival/" target="_blank" rel="noopener noreferrer">查看互動問卷 ↗</a>' : ''}${['quiz','report'].includes(item.id) ? '<p class="work-boundary">此案例展示互動與資訊交付設計，內容不作為健康診斷。</p>' : ''}<div class="case-service-links"><span>從這個方法，延伸到你的需求</span>${related.map(service=>`<a href="#services" data-find-service="${service.id}">${service.name} ↗</a>`).join('')}</div></div></details></div></article>`;
  }).join('');
}
document.querySelector('#case-filters').addEventListener('click', event => {
  const button = event.target.closest('[data-case-filter]'); if (!button) return;
  activeCaseFilter = button.dataset.caseFilter; renderPortfolio();
  document.querySelector(`[data-case-filter="${activeCaseFilter}"]`).focus({preventScroll:true});
});
function revealCase(id, shouldScroll = true) {
  if (!caseById.has(id)) return;
  if (!document.querySelector(`#case-${id}`)) {activeCaseFilter = 'all'; renderPortfolio();}
  const card = document.querySelector(`#case-${id}`);
  card.querySelector('details').open = true;
  if (shouldScroll) card.scrollIntoView({block:'start'});
}
document.addEventListener('click', event => {
  const link = event.target.closest('[data-show-case]');
  if (link) { event.preventDefault(); history.pushState(null,'',link.getAttribute('href')); revealCase(link.dataset.showCase); document.querySelector(`#case-${link.dataset.showCase} summary`).focus({preventScroll:true}); }
  const serviceLink = event.target.closest('[data-find-service]');
  if (serviceLink) {
    event.preventDefault(); const service = byId.get(serviceLink.dataset.findService);
    activeFacet = service.facet; activeCategory = service.categoryIndex;
    renderFacets(); renderTabs(); renderCategory(activeCategory);
    history.pushState(null,'','#services');
    const button = document.querySelector(`[data-service-id="${service.id}"]`);
    button.closest('article').scrollIntoView({block:'center'}); button.focus({preventScroll:true});
  }
});
function readCaseHash() {
  const id = location.hash.replace('#case-','');
  // Preserve links to the earlier portfolio preview.
  revealCase(id === 'fuyun' ? 'quiz' : id === 'workflow' ? 'payroll' : id);
}
renderPortfolio();
window.addEventListener('hashchange',readCaseHash);
readCaseHash();
