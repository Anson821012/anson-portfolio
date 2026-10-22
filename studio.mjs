import * as THREE from './vendor/three-0.180.0/three.module.min.js';
import {studioZones} from './studio-data.mjs';

const stage=document.querySelector('[data-studio-stage]');
if(stage) startStudio();

function startStudio(){
  const canvas=stage.querySelector('canvas');
  const labels=new Map([...stage.querySelectorAll('[data-zone-label]')].map(el=>[el.dataset.zoneLabel,el]));
  const indexButtons=[...document.querySelectorAll('[data-studio-index]')];
  const cards=[...document.querySelectorAll('[data-studio-card]')];
  const overview=document.querySelector('[data-studio-overview]');
  const status=document.querySelector('[data-studio-status]');
  const pauseButton=document.querySelector('[data-studio-pause]');
  const homeButton=document.querySelector('[data-studio-home]');
  const startButton=document.querySelector('[data-studio-start]');
  const resetButton=document.querySelector('[data-studio-reset]');
  const progressText=document.querySelector('[data-studio-progress-text]');
  const progressTrack=document.querySelector('.studio-progress-track');
  const progressFill=document.querySelector('[data-studio-progress-fill]');
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
  const questKey='anson-marketing-quest-v1';
  let completed=readProgress();
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  }catch(error){
    stage.dataset.renderer='fallback';
    status.textContent='3D 場景未啟用，仍可使用下方六個入口。';
    return;
  }

  const scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0xf2f8fb,31,49);
  const camera=new THREE.PerspectiveCamera(35,1,.1,100);
  const cameraTarget=new THREE.Vector3(0,0,0);
  let cameraDistance=23;
  camera.position.set(0,16,cameraDistance);
  camera.lookAt(cameraTarget);

  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xf2f8fb,0);

  scene.add(new THREE.HemisphereLight(0xffffff,0xc8dce5,2.55));
  const key=new THREE.DirectionalLight(0xffffff,3.2);
  key.position.set(-9,18,10);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-22;key.shadow.camera.right=22;key.shadow.camera.top=22;key.shadow.camera.bottom=-22;
  scene.add(key);
  const rim=new THREE.DirectionalLight(0xa8cad9,1.15);rim.position.set(13,8,-10);scene.add(rim);

  const world=new THREE.Group();
  world.rotation.y=-.12;
  scene.add(world);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(15,64),new THREE.MeshStandardMaterial({color:0xfafdff,roughness:.96,metalness:0}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.02;floor.receiveShadow=true;world.add(floor);
  const floorRing=new THREE.Mesh(new THREE.RingGeometry(10.7,14.4,64),new THREE.MeshBasicMaterial({color:0xe4eff4,transparent:true,opacity:.62,side:THREE.DoubleSide}));
  floorRing.rotation.x=-Math.PI/2;floorRing.position.y=.005;world.add(floorRing);

  const tileMeshes=[];
  const zoneGroups=[];
  studioZones.forEach((zone,index)=>{
    const angle=(index/6)*Math.PI*2-Math.PI/2;
    const x=Math.cos(angle)*8.3;
    const z=Math.sin(angle)*8.3;
    const group=createZone(zone,index);
    group.position.set(x,0,z);
    group.rotation.y=-angle-Math.PI/2;
    group.userData.zone=zone;
    group.userData.angle=angle;
    world.add(group);zoneGroups.push(group);
    tileMeshes.push(group.userData.hit);
    const bridge=new THREE.Mesh(new THREE.BoxGeometry(4.2,.17,1.05),new THREE.MeshStandardMaterial({color:0xe5eff4,roughness:.9}));
    bridge.position.set(x*.53,.12,z*.53);bridge.rotation.y=-angle;bridge.receiveShadow=true;world.add(bridge);
  });
  world.add(createRobot());
  const centerPad=new THREE.Mesh(new THREE.CylinderGeometry(3.35,3.55,.5,48),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.78}));
  centerPad.position.y=.23;centerPad.receiveShadow=true;centerPad.castShadow=true;world.add(centerPad);
  world.children.splice(world.children.indexOf(centerPad),1);world.children.unshift(centerPad);

  const raycaster=new THREE.Raycaster();
  const pointer=new THREE.Vector2();
  let selected=null;
  let paused=prefersReduced.matches;
  let dragging=false;
  let moved=false;
  let downX=0,downY=0,lastX=0;
  let targetRotation=world.rotation.y;
  let currentRotation=world.rotation.y;
  let activePointer=null;

  function readProgress(){
    try{
      const saved=JSON.parse(localStorage.getItem(questKey)||'[]');
      return Array.isArray(saved)?saved.filter(id=>studioZones.some(zone=>zone.id===id)):[];
    }catch{return [];}
  }
  function completedCount(){
    let count=0;
    while(count<studioZones.length&&completed.includes(studioZones[count].id))count++;
    return count;
  }
  function isUnlocked(id){return studioZones.findIndex(zone=>zone.id===id)<=completedCount();}
  function saveProgress(){
    try{localStorage.setItem(questKey,JSON.stringify(completed));}catch{}
  }
  function refreshQuest(){
    const done=completedCount();
    progressText.textContent=done===studioZones.length?'六關完成！你已走完行銷整理路線':`已完成 ${done} / ${studioZones.length} 關`;
    progressTrack.setAttribute('aria-valuenow',String(done));
    progressFill.style.width=`${done/studioZones.length*100}%`;
    [...labels.entries()].forEach(([id,button])=>updateLevelButton(button,id));
    indexButtons.forEach(button=>updateLevelButton(button,button.dataset.studioIndex));
    cards.forEach(card=>{
      const doneHere=completed.includes(card.dataset.studioCard);
      card.classList.toggle('is-complete',doneHere);
      if(doneHere){
        const feedback=card.querySelector('[data-quiz-feedback]');
        if(!feedback.textContent.trim()){
          feedback.textContent=`已過關：${studioZones.find(zone=>zone.id===card.dataset.studioCard).reward}`;
          feedback.dataset.state='success';
        }
        const next=card.querySelector('[data-next-level]');
        const index=Number(card.dataset.levelIndex);
        next.hidden=index>=studioZones.length-1;
        if(!next.hidden)next.textContent=`前往第 ${String(index+2).padStart(2,'0')} 關 →`;
      }
    });
  }
  function updateLevelButton(button,id){
    const done=completed.includes(id),locked=!isUnlocked(id);
    button.dataset.locked=String(locked);
    button.dataset.complete=String(done);
    button.setAttribute('aria-disabled',String(locked));
    const state=button.querySelector('[data-level-state]');
    if(state)state.textContent=done?'已過關 ✓':locked?'🔒 待解鎖':'可以挑戰';
  }

  function createZone(zone,index){
    const group=new THREE.Group();
    const material=new THREE.MeshStandardMaterial({color:zone.color,roughness:.72,metalness:.02,emissive:zone.accent,emissiveIntensity:.025});
    const tile=new THREE.Mesh(new THREE.CylinderGeometry(2.55,2.72,.56,6),material);
    tile.position.y=.28;tile.castShadow=true;tile.receiveShadow=true;tile.userData.zoneId=zone.id;group.add(tile);group.userData.hit=tile;
    const lip=new THREE.Mesh(new THREE.TorusGeometry(2.34,.055,8,6),new THREE.MeshBasicMaterial({color:zone.accent,transparent:true,opacity:.62}));
    lip.rotation.x=Math.PI/2;lip.rotation.z=Math.PI/6;lip.position.y=.59;group.add(lip);
    addSceneProps(group,zone,index);
    const anchor=new THREE.Object3D();anchor.position.set(0,3.2,0);group.add(anchor);group.userData.anchor=anchor;
    return group;
  }

  function material(color,roughness=.72){return new THREE.MeshStandardMaterial({color,roughness,metalness:.02});}
  function box(parent,size,pos,color,rotation=[0,0,0]){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material(color));mesh.position.set(...pos);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  function sphere(parent,r,pos,color){const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),material(color,.6));mesh.position.set(...pos);mesh.castShadow=true;parent.add(mesh);return mesh;}
  function cylinder(parent,r,h,pos,color,segments=20){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material(color));mesh.position.set(...pos);mesh.castShadow=true;parent.add(mesh);return mesh;}

  function addSceneProps(group,zone,index){
    const navy=0x29485e,blue=zone.accent,white=0xffffff,pale=0xd9e9f0,cream=0xf9fcfd;
    if(zone.scene==='compass'){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.82,.11,10,32),material(blue,.48));ring.position.y=.83;ring.rotation.x=Math.PI/2;ring.castShadow=true;group.add(ring);
      const needle=new THREE.Mesh(new THREE.ConeGeometry(.22,1.15,4),material(navy,.5));needle.position.set(0,1.04,0);needle.rotation.x=Math.PI/2;needle.rotation.z=.55;group.add(needle);
      sphere(group,.22,[0,1.05,0],white);
    }
    if(zone.scene==='brand'){
      box(group,[1.5,1.55,.18],[0,1.27,-.05],white,[0,0,0]);
      box(group,[1.2,.14,.08],[0,1.58,.06],blue,[0,0,-.18]);
      sphere(group,.25,[-.39,1.16,.08],blue);sphere(group,.18,[.22,1.16,.08],pale);sphere(group,.13,[.55,1.16,.08],navy);
      box(group,[1.9,.15,.55],[0,.75,0],0xc7dce6);
    }
    if(zone.scene==='content'){
      box(group,[1.55,1.1,.16],[-.2,1.32,-.05],white);
      box(group,[1.15,.12,.07],[-.2,1.5,.05],blue);box(group,[.8,.08,.07],[-.36,1.25,.05],pale);box(group,[.52,.08,.07],[-.5,1.04,.05],pale);
      const cone=new THREE.Mesh(new THREE.ConeGeometry(.38,.8,18,1,true),material(blue,.55));cone.position.set(.85,1.03,.35);cone.rotation.z=-Math.PI/2;cone.castShadow=true;group.add(cone);
      cylinder(group,.12,.48,[1.12,.79,.35],navy,12);
    }
    if(zone.scene==='customer'){
      cylinder(group,.82,.18,[0,.82,0],white,28);
      cylinder(group,.09,.75,[0,.42,0],navy,12);
      [-.95,.95].forEach((x,i)=>{box(group,[.7,.15,.7],[x,.62,.04],i?blue:pale);box(group,[.62,.72,.13],[x,.97,.36],i?blue:pale,[.05,0,0]);});
      sphere(group,.18,[0,1.04,0],0xb5d0dc);
    }
    if(zone.scene==='operations'){
      box(group,[2.2,.28,.7],[0,.76,0],0xc7dce6);
      [-.75,0,.75].forEach((x,i)=>box(group,[.5,.5,.5],[x,1.12,0],i===1?blue:white,[0,i*.18,0]));
      for(let i=-2;i<=2;i++) cylinder(group,.11,.84,[i*.45,.45,0],navy,12);
    }
    if(zone.scene==='systems'){
      [-.66,0,.66].forEach((x,i)=>{box(group,[.5,1.4,.62],[x,1.3,0],i===1?blue:white);for(let y=.9;y<1.75;y+=.28)sphere(group,.035,[x+.18,y,.32],i===1?white:blue);});
      const lineMat=new THREE.LineBasicMaterial({color:blue});
      const points=[new THREE.Vector3(-.66,2.18,0),new THREE.Vector3(0,2.45,0),new THREE.Vector3(.66,2.18,0)];group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),lineMat));sphere(group,.13,[0,2.45,0],blue);
    }
    const numberPlate=box(group,[.72,.06,.36],[-1.45,.66,1.05],cream,[0,0,0]);numberPlate.userData.decorative=true;
  }

  function createRobot(){
    const robot=new THREE.Group();robot.position.y=.53;robot.rotation.y=-.25;
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.75,1.25,6,18),material(0xffffff,.55));body.position.y=1.13;body.castShadow=true;robot.add(body);
    const face=new THREE.Mesh(new THREE.BoxGeometry(1.38,.79,.22),material(0xe8f3f7,.38));face.position.set(0,1.55,.69);face.castShadow=true;robot.add(face);
    const faceGlass=new THREE.Mesh(new THREE.PlaneGeometry(1.08,.52),new THREE.MeshStandardMaterial({color:0x29485e,roughness:.3,metalness:.1}));faceGlass.position.set(0,1.55,.807);robot.add(faceGlass);
    [-.27,.27].forEach(x=>{const eye=sphere(robot,.075,[x,1.58,.825],0xa9d1e1);eye.scale.y=1.25;});
    const smile=new THREE.Mesh(new THREE.TorusGeometry(.18,.026,6,18,Math.PI),new THREE.MeshBasicMaterial({color:0xa9d1e1}));smile.position.set(0,1.43,.832);smile.rotation.z=Math.PI;robot.add(smile);
    [-.78,.78].forEach((x,i)=>{const arm=cylinder(robot,.12,.88,[x,1.12,.04],0xffffff,14);arm.rotation.z=i?-.35:.35;});
    [-.33,.33].forEach(x=>cylinder(robot,.18,.55,[x,.32,0],0xffffff,16));
    const antenna=cylinder(robot,.035,.35,[0,2.36,0],0x29485e,10);sphere(robot,.1,[0,2.58,0],0xa7c8d6);
    robot.traverse(obj=>{if(obj.isMesh)obj.castShadow=true;});return robot;
  }

  function selectZone(id,{focus=true}={}){
    if(!isUnlocked(id)){
      const next=studioZones[completedCount()];
      status.textContent=`這關還鎖著。請先完成「${next?.title||'前一關'}」。`;
      const button=indexButtons.find(item=>item.dataset.studioIndex===id);
      button?.animate([{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'none'}],{duration:260});
      return;
    }
    selected=studioZones.find(zone=>zone.id===id)||null;
    overview.hidden=!!selected;
    cards.forEach(card=>card.hidden=card.dataset.studioCard!==id);
    labels.forEach((label,key)=>label.setAttribute('aria-pressed',String(key===id)));
    indexButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.studioIndex===id)));
    zoneGroups.forEach(group=>{
      const active=group.userData.zone.id===id;
      group.userData.hit.material.emissiveIntensity=active ? .18 : .025;
      group.userData.hit.scale.set(active?1.06:1,active?1.09:1,active?1.06:1);
    });
    if(selected&&focus){
      const group=zoneGroups.find(item=>item.userData.zone.id===id);
      targetRotation=-group.userData.angle-Math.PI/2;
      cameraDistance=20;
      if(innerWidth<801)document.querySelector('.studio-panel')?.scrollIntoView({behavior:prefersReduced.matches?'auto':'smooth',block:'nearest'});
    }
    if(selected)status.textContent=`第 ${selected.number} 關「${selected.title}」已打開。讀完情境後選一個答案。`;
    renderFrame();
  }
  function resetView(){
    selected=null;overview.hidden=false;cards.forEach(card=>card.hidden=true);
    labels.forEach(label=>label.setAttribute('aria-pressed','false'));indexButtons.forEach(button=>button.setAttribute('aria-pressed','false'));
    zoneGroups.forEach(group=>{group.userData.hit.material.emissiveIntensity=.025;group.userData.hit.scale.set(1,1,1);});
    targetRotation=-.12;cameraDistance=23;status.textContent='回到闖關地圖。從第一個未完成關卡繼續。';renderFrame();
  }

  function pointerPosition(event){const rect=canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;}
  canvas.addEventListener('pointerdown',event=>{dragging=true;moved=false;activePointer=event.pointerId;downX=lastX=event.clientX;downY=event.clientY;canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{
    pointerPosition(event);
    if(!dragging||event.pointerId!==activePointer)return;
    const dx=event.clientX-lastX;lastX=event.clientX;if(Math.abs(event.clientX-downX)+Math.abs(event.clientY-downY)>5)moved=true;
    targetRotation+=dx*.008;renderFrame();
  });
  canvas.addEventListener('pointerup',event=>{
    if(event.pointerId!==activePointer)return;dragging=false;canvas.releasePointerCapture(event.pointerId);
    if(!moved){pointerPosition(event);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(tileMeshes,false)[0];if(hit)selectZone(hit.object.userData.zoneId);}
  });
  canvas.addEventListener('pointercancel',()=>{dragging=false;activePointer=null;});
  canvas.addEventListener('wheel',event=>{event.preventDefault();cameraDistance=THREE.MathUtils.clamp(cameraDistance+event.deltaY*.012,17,29);renderFrame();},{passive:false});
  labels.forEach((button,id)=>button.addEventListener('click',()=>selectZone(id)));
  indexButtons.forEach(button=>button.addEventListener('click',()=>selectZone(button.dataset.studioIndex)));
  startButton.addEventListener('click',()=>selectZone(studioZones[Math.min(completedCount(),studioZones.length-1)].id));
  resetButton.addEventListener('click',()=>{
    completed=[];saveProgress();
    document.querySelectorAll('[data-studio-quiz]').forEach(form=>{
      form.reset();form.closest('[data-studio-card]').classList.remove('is-complete');
      const feedback=form.querySelector('[data-quiz-feedback]');feedback.textContent='';delete feedback.dataset.state;
      form.querySelector('[data-next-level]').hidden=true;
    });
    refreshQuest();resetView();status.textContent='闖關進度已重置。從第一關重新開始吧。';
  });
  document.querySelectorAll('[data-studio-quiz]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();
    const zone=studioZones.find(item=>item.id===form.dataset.studioQuiz);
    const choice=form.querySelector('input:checked');
    const feedback=form.querySelector('[data-quiz-feedback]');
    if(!choice){feedback.textContent='先選一個答案，再看看你的判斷。';feedback.dataset.state='hint';return;}
    if(Number(choice.value)!==zone.quiz.correct){
      feedback.textContent=`再想一下：${zone.quiz.hint}`;feedback.dataset.state='hint';
      form.classList.remove('quiz-correct');form.classList.add('quiz-try-again');
      setTimeout(()=>form.classList.remove('quiz-try-again'),420);return;
    }
    if(!completed.includes(zone.id))completed.push(zone.id);
    saveProgress();feedback.textContent=`${zone.quiz.success} ${zone.reward}`;feedback.dataset.state='success';
    form.classList.add('quiz-correct');refreshQuest();
    document.body.classList.remove('quest-celebrate');void document.body.offsetWidth;document.body.classList.add('quest-celebrate');
    setTimeout(()=>document.body.classList.remove('quest-celebrate'),900);
    const nextIndex=studioZones.findIndex(item=>item.id===zone.id)+1;
    status.textContent=nextIndex<studioZones.length?`過關！第 ${studioZones[nextIndex].number} 關已解鎖。`:'六關全部完成！你已把行銷、營運與 AI 串成一條完整路線。';
  }));
  document.querySelectorAll('[data-next-level]').forEach(button=>button.addEventListener('click',()=>{
    const card=button.closest('[data-studio-card]');
    const next=studioZones[Number(card.dataset.levelIndex)+1];
    if(next)selectZone(next.id);
  }));
  homeButton.addEventListener('click',resetView);
  pauseButton.addEventListener('click',()=>{paused=!paused;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.querySelector('span').textContent=paused?'繼續轉動':'暫停轉動';status.textContent=paused?'工作室已暫停自動轉動。':'工作室會慢慢轉動，也可以用滑鼠拖曳。';if(!paused)requestAnimationFrame(animate);});
  prefersReduced.addEventListener('change',event=>{paused=event.matches;pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.querySelector('span').textContent=paused?'繼續轉動':'暫停轉動';renderFrame();});

  function resize(){
    const width=stage.clientWidth,height=stage.clientHeight;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();renderFrame();
  }
  function updateCamera(){
    const mobile=innerWidth<801;
    camera.position.set(0,mobile?15.8:16.5,cameraDistance);camera.lookAt(cameraTarget);
  }
  function updateLabels(){
    const rect=stage.getBoundingClientRect();
    zoneGroups.forEach(group=>{
      const zone=group.userData.zone,label=labels.get(zone.id);if(!label)return;
      const point=new THREE.Vector3();group.userData.anchor.getWorldPosition(point);point.project(camera);
      const visible=point.z<1&&Math.abs(point.x)<.93&&Math.abs(point.y)<.96;
      label.style.left=`${(point.x*.5+.5)*rect.width}px`;label.style.top=`${(-point.y*.5+.5)*rect.height}px`;label.style.opacity=visible?'1':'0';label.style.pointerEvents=visible?'auto':'none';
    });
  }
  function renderFrame(){
    currentRotation=THREE.MathUtils.lerp(currentRotation,targetRotation,.1);world.rotation.y=currentRotation;updateCamera();renderer.render(scene,camera);updateLabels();
  }
  let last=0;
  function animate(time=0){
    if(paused)return;
    if(!dragging&&!selected&&time-last>16)targetRotation+=.00055*(time-last||16);
    currentRotation=THREE.MathUtils.lerp(currentRotation,targetRotation,.055);world.rotation.y=currentRotation;
    updateCamera();renderer.render(scene,camera);updateLabels();last=time;requestAnimationFrame(animate);
  }
  const observer=new ResizeObserver(resize);observer.observe(stage);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!paused)requestAnimationFrame(animate);});
  pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.querySelector('span').textContent=paused?'繼續轉動':'暫停轉動';
  refreshQuest();resize();if(!paused)requestAnimationFrame(animate);else renderFrame();
}
