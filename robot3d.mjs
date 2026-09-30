import {createAnimationLoop, clamp} from './robot-state.mjs';

const stage = document.querySelector('[data-robot-stage]');
if (stage) {
  const root = document.documentElement;
  const art = stage.closest('.hero-art');
  const canvas = stage.querySelector('canvas');
  const status = art.querySelector('[data-robot-status]');
  const wave = art.querySelector('[data-robot-wave]');
  const pause = art.querySelector('[data-robot-pause]');
  const guide = art.querySelector('.robot-guide');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let robot, loading = false, failed = false, visible = false, ended = false, covered = false;
  let paused = false;
  try { paused = localStorage.getItem('office-motion-paused') === 'true'; } catch { /* Optional preference. */ }
  let gesture = {kind:'idle',started:0,gaze:{x:0,y:0}};
  let smoothGaze = {x:0,y:0};
  const loop = createAnimationLoop({requestFrame:requestAnimationFrame,cancelFrame:cancelAnimationFrame,
    fps:matchMedia('(max-width: 800px)').matches ? 30 : 45,
    render(time) {
      if (!robot) return;
      smoothGaze.x += (gesture.gaze.x-smoothGaze.x)*.13;
      smoothGaze.y += (gesture.gaze.y-smoothGaze.y)*.13;
      try { robot.render(time,{...gesture,gaze:smoothGaze}); }
      catch { fallback(); }
    },
  });
  function fallback() {
    failed = true; loop.stop(); robot?.dispose(); robot=null;
    stage.dataset.renderer='fallback'; wave.hidden=true;
    status.textContent='先從一件小麻煩開始。';
  }
  function sync() {
    const stopped = paused || media.matches;
    root.dataset.motionPaused=String(stopped);
    pause.setAttribute('aria-pressed',String(stopped));
    pause.textContent=media.matches ? '已減少動態' : paused ? '繼續動畫' : '暫停動畫';
    pause.disabled=media.matches;
    wave.disabled=stopped;
    if (stopped || !visible || document.hidden || ended || covered) loop.stop();
    else if (robot) loop.start();
    else if (!failed) load();
  }
  async function load() {
    if (loading || robot || failed || ended || media.matches || paused || !visible || document.hidden || covered) return;
    loading=true;
    try {
      const {createRobot} = await import('./robot-model.mjs');
      // The visitor can pause or navigate away while the module is loading.
      if (ended || media.matches || paused || !visible || document.hidden || covered) return;
      robot=createRobot(canvas,{onContextLost:fallback,compact:matchMedia('(max-width: 800px)').matches});
      loop.renderOnce();
      if (failed) return;
      stage.dataset.renderer='ready'; wave.hidden=false;
      status.textContent='嗨，我是整理小幫手。';
      sync();
    } catch { fallback(); }
    finally { loading=false; }
  }
  art.classList.add('robot-enhanced');
  pause.hidden=false;
  wave.addEventListener('click',() => {
    gesture.kind='wave'; gesture.started=loop.time;
    status.textContent='嗨！麻煩先放著，我們一起看。';
    guide.open=false;
  });
  guide.addEventListener('toggle',() => {
    if (!guide.open && gesture.kind === 'wave') return;
    gesture.kind=guide.open ? 'tidy' : 'idle'; gesture.started=loop.time - (paused || media.matches ? 1.3 : 0);
    status.textContent=guide.open ? '不用一次全部處理。先挑一件就好。' : '嗨，我是整理小幫手。';
    if (paused || media.matches) loop.renderOnce();
  });
  pause.addEventListener('click',() => {
    paused=!paused;
    try { localStorage.setItem('office-motion-paused',String(paused)); } catch { /* Optional preference. */ }
    sync();
  });
  document.addEventListener('office:guide-state',event=>{
    const state=event.detail?.state;
    if(state==='open')covered=true;
    if(state==='close')covered=false;
    if(state==='result'||state==='added') {
      gesture.kind='tidy';gesture.started=loop.time;
      status.textContent=state==='added' ? '收好了。接下來，我們一起聊。' : '找到起點了，先從一件事開始。';
    }
    sync();
  });
  art.addEventListener('pointermove',event => {
    if (!fine.matches || paused || media.matches) return;
    const box=art.getBoundingClientRect();
    gesture.gaze={x:clamp((event.clientX-box.left)/box.width*2-1,-1,1),y:clamp((event.clientY-box.top)/box.height*2-1,-1,1)};
  },{passive:true});
  art.addEventListener('pointerleave',() => {gesture.gaze={x:0,y:0};},{passive:true});
  const observer = new IntersectionObserver(entries => { visible=entries[0].isIntersecting; sync(); },{threshold:0});
  observer.observe(art);
  const resize = new ResizeObserver(() => { if (robot) {robot.resize(); loop.renderOnce();} });
  resize.observe(stage);
  document.addEventListener('visibilitychange',sync);
  media.addEventListener('change',sync);
  // BFCache pages keep their canvas; a true navigation frees GPU resources.
  window.addEventListener('pagehide',event => {
    loop.stop();
    if (!event.persisted) { ended=true; observer.disconnect(); resize.disconnect(); robot?.dispose(); }
  });
  window.addEventListener('pageshow',sync);
  sync();
}
