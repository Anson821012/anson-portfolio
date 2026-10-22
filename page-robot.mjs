import {createAnimationLoop,clamp} from './robot-state.mjs';

const worlds=[...document.querySelectorAll('[data-page-robot]')];
const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');

for(const world of worlds) enhance(world);

function enhance(world){
  const canvas=world.querySelector('canvas');
  const stage=world.querySelector('[data-page-robot-stage]');
  const status=world.querySelector('[data-page-robot-status]');
  const response=world.querySelector('[data-page-robot-response]');
  const responseText=response.querySelector('p');
  const responseLink=response.querySelector('a');
  const pause=world.querySelector('[data-page-robot-pause]');
  const progress=world.querySelector('[data-page-robot-progress]');
  const buttons=[...world.querySelectorAll('[data-page-robot-choice]')];
  const key=`anson-robot-${world.dataset.pageRobot}-v1`;
  let explored=new Set();
  let robot=null,loading=false,failed=false,visible=false,ended=false;
  let paused=motionMedia.matches;
  try{paused=motionMedia.matches||localStorage.getItem('office-motion-paused')==='true';explored=new Set(JSON.parse(localStorage.getItem(key)||'[]'));}catch{/* Optional local progress. */}
  let gesture={kind:'idle',started:0,gaze:{x:0,y:0}};
  let smooth={x:0,y:0};
  const loop=createAnimationLoop({requestFrame:requestAnimationFrame,cancelFrame:cancelAnimationFrame,fps:matchMedia('(max-width:800px)').matches?30:45,render(time){
    if(!robot)return;
    smooth.x+=(gesture.gaze.x-smooth.x)*.13;smooth.y+=(gesture.gaze.y-smooth.y)*.13;
    try{robot.render(time,{...gesture,gaze:smooth});}catch{fallback();}
  }});
  function updateProgress(){
    progress.textContent=`已探索 ${explored.size} / ${buttons.length} 個方向`;
    buttons.forEach((button,index)=>button.classList.toggle('is-visited',explored.has(index)));
  }
  function updateMotion(){
    const stopped=paused||motionMedia.matches;
    pause.textContent=motionMedia.matches?'已減少動態':stopped?'繼續動畫':'暫停動畫';
    pause.disabled=motionMedia.matches;
    pause.setAttribute('aria-pressed',String(stopped));
    if(stopped||!visible||document.hidden||ended)loop.stop();
    else if(robot)loop.start();
    else if(!failed)load();
  }
  async function load(){
    if(loading||robot||failed||paused||motionMedia.matches||!visible||document.hidden||ended)return;
    loading=true;
    try{
      const {createRobot}=await import('./robot-model.mjs');
      if(paused||motionMedia.matches||!visible||document.hidden||ended)return;
      robot=createRobot(canvas,{compact:matchMedia('(max-width:800px)').matches,accent:Number(world.dataset.robotAccent),onContextLost:fallback});
      stage.dataset.renderer='ready';loop.renderOnce();updateMotion();
    }catch{fallback();}finally{loading=false;}
  }
  function fallback(){failed=true;loop.stop();robot?.dispose();robot=null;stage.dataset.renderer='fallback';}
  buttons.forEach((button,index)=>button.addEventListener('click',()=>{
    buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    explored.add(index);try{localStorage.setItem(key,JSON.stringify([...explored]));}catch{/* Optional local progress. */}
    updateProgress();
    responseText.textContent=button.dataset.message;
    responseLink.href=button.dataset.href;responseLink.textContent=`${button.dataset.linkLabel} →`;
    response.hidden=false;status.textContent=`整理小幫手說：${button.dataset.message}`;
    gesture.kind=button.dataset.gesture||'wave';gesture.started=loop.time;
    if(paused||motionMedia.matches)loop.renderOnce();
  }));
  pause.addEventListener('click',()=>{
    paused=!paused;try{localStorage.setItem('office-motion-paused',String(paused));}catch{/* Optional preference. */}
    updateMotion();
  });
  responseLink.addEventListener('click',()=>{
    if(!responseLink.hash)return;
    const target=document.querySelector(responseLink.hash);
    if(target?.tagName==='DETAILS')target.open=true;
  });
  stage.addEventListener('pointermove',event=>{
    if(!finePointer.matches||paused||motionMedia.matches)return;
    const box=stage.getBoundingClientRect();gesture.gaze={x:clamp((event.clientX-box.left)/box.width*2-1,-1,1),y:clamp((event.clientY-box.top)/box.height*2-1,-1,1)};
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{gesture.gaze={x:0,y:0};},{passive:true});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updateMotion();},{threshold:.05});observer.observe(stage);
  const resize=new ResizeObserver(()=>{if(robot){robot.resize();loop.renderOnce();}});resize.observe(stage);
  document.addEventListener('visibilitychange',updateMotion);motionMedia.addEventListener('change',()=>{paused=motionMedia.matches;updateMotion();});
  window.addEventListener('pagehide',event=>{loop.stop();if(!event.persisted){ended=true;observer.disconnect();resize.disconnect();robot?.dispose();}});
  window.addEventListener('pageshow',updateMotion);
  world.classList.add('is-enhanced');pause.hidden=false;updateProgress();updateMotion();
}
