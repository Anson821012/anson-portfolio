'use strict';
// Mobile pages share the existing URLs and content with the desktop site.
(() => {
  const media = matchMedia('(max-width:800px)');
  const pages = [...document.querySelectorAll('[data-mobile-page]')];
  const nav = document.querySelector('.mobile-nav');
  const titles = {top:'首頁',growth:'成果紀錄',services:'整理服務',cases:'作品筆記',about:'關於 Anson'};
  let active = 'top';

  function targetFor(hash) {
    try { return document.getElementById(decodeURIComponent(hash.replace(/^#/,''))); }
    catch { return null; }
  }
  function pageFor(hash) {
    if (hash.startsWith('#case-')) return 'cases';
    if (hash === '#main') return active;
    return targetFor(hash)?.closest('[data-mobile-page]')?.dataset.mobilePage || 'top';
  }
  function display(hash, {scroll = true, focus = false} = {}) {
    active = pageFor(hash);
    document.documentElement.classList.toggle('mobile-app',media.matches);
    pages.forEach(page => {
      page.hidden = media.matches && page.dataset.mobilePage !== active;
      page.inert = page.hidden;
    });
    nav.querySelectorAll('a').forEach(link => {
      if (link.hash === `#${active}`) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('#page-status').textContent = media.matches ? `${titles[active]}` : '';
    if (!scroll) return;
    const target = (hash === '#main' ? document.getElementById(active) : targetFor(hash)) || document.getElementById(active);
    for (let parent = target?.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
    if (media.matches && hash === `#${active}`) window.scrollTo({top:0,behavior:'instant'});
    else target?.scrollIntoView({block:'start',behavior:'instant'});
    if (focus && media.matches) {
      const heading = target?.matches('h1,h2,h3') ? target : target?.querySelector('h1,h2,h3') || target;
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    }
  }
  function go(hash, options = {}) {
    if (location.hash !== hash) history.pushState(null,'',hash);
    display(hash,options);
  }
  window.officeNavigation = {go};
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!media.matches || !link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('data-show-case') || link.hasAttribute('data-find-service')) return;
    if (!targetFor(link.hash)) return;
    event.preventDefault();
    go(link.hash,{focus:true});
  });
  function setDisclosureDefaults() {
    document.querySelectorAll('.mobile-fold,.service-specs').forEach(detail => { detail.open = !media.matches; });
  }
  media.addEventListener('change', () => {
    setDisclosureDefaults();
    display(location.hash || '#top',{scroll:false});
  });
  window.addEventListener('hashchange', () => display(location.hash || '#top',{focus:true}));
  setDisclosureDefaults();
  display(location.hash || '#top',{scroll:false});
  // Native fragment scrolling can happen before hidden panels have been revealed.
  window.addEventListener('load', () => {
    if (location.hash && !location.hash.startsWith('#case-')) display(location.hash,{scroll:true});
  },{once:true});
})();
