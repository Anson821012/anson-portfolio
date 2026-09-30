(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  const root = document.documentElement;
  root.classList.add('motion-ready');

  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    for (const element of heroArt.querySelectorAll('.scene-frame,.hero-robot-pop')) {
      element.addEventListener('animationend', event => {
        if (event.target === element) element.classList.add('motion-entered');
      }, {once:true});
    }
  }
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (heroArt && finePointer.matches) {
    let frame = 0;
    const updateDepth = event => {
      if (root.dataset.motionPaused === 'true' || reduceMotion.matches) return;
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        heroArt.style.setProperty('--scene-rx', `${(-y * 4).toFixed(2)}deg`);
        heroArt.style.setProperty('--scene-ry', `${(x * 5).toFixed(2)}deg`);
        heroArt.style.setProperty('--scene-x', `${(x * 5).toFixed(2)}px`);
        heroArt.style.setProperty('--scene-y', `${(y * 4).toFixed(2)}px`);
        heroArt.style.setProperty('--robot-x', `${(x * 13).toFixed(2)}px`);
        heroArt.style.setProperty('--robot-y', `${(y * 9).toFixed(2)}px`);
      });
    };
    const resetDepth = () => {
      cancelAnimationFrame(frame);
      for (const property of ['--scene-rx','--scene-ry','--scene-x','--scene-y','--robot-x','--robot-y']) {
        heroArt.style.removeProperty(property);
      }
    };
    heroArt.addEventListener('pointermove', updateDepth, {passive:true});
    heroArt.addEventListener('pointerleave', resetDepth, {passive:true});
  }

  const revealSelector = [
    '.home-directory .directory-card',
    '.growth-heading',
    '.growth-metric',
    '.growth-story',
    '.search-comparison',
    '.service-scene',
    '.service-discovery',
    '.service-menu',
    '.cases-section .section-heading',
    '.care-grid article',
    '.portfolio-card',
    '.about-section > *',
    '.process-grid article',
    '.contact-inner > *'
  ].join(',');

  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, {rootMargin:'0px 0px -8% 0px', threshold:.08});

  const prepareReveal = (element, index = 0) => {
    if (!(element instanceof HTMLElement) || element.classList.contains('motion-reveal')) return;
    element.classList.add('motion-reveal');
    element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 70}ms`);
    revealObserver.observe(element);
  };

  document.querySelectorAll(revealSelector).forEach(prepareReveal);

  const dynamicObserver = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(revealSelector)) prepareReveal(node);
        node.querySelectorAll?.(revealSelector).forEach(prepareReveal);
      }
    }
  });
  dynamicObserver.observe(document.body, {subtree:true, childList:true});

  const sections = [
    ['top','首頁'],
    ['growth','成果'],
    ['services','服務'],
    ['cases','作品'],
    ['about','關於']
  ].map(([id,label]) => ({id,label,element:document.getElementById(id)})).filter(item => item.element);

  if (sections.length) {
    const nav = document.createElement('nav');
    nav.className = 'motion-progress';
    nav.setAttribute('aria-label','頁面段落');
    for (const section of sections) {
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.dataset.section = section.id;
      link.setAttribute('aria-label',section.label);
      const label = document.createElement('span');
      label.textContent = section.label;
      link.append(label);
      nav.append(link);
    }
    document.body.append(nav);

    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      nav.querySelectorAll('a').forEach(link => {
        if (link.dataset.section === visible.target.id) link.setAttribute('aria-current','true');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-35% 0px -45% 0px', threshold:[0,.1,.35,.65]});
    sections.forEach(section => sectionObserver.observe(section.element));
    nav.querySelector('a')?.setAttribute('aria-current','true');
  }
})();
