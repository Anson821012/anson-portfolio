import * as T from './vendor/three-0.180.0/three.module.min.js';
import {clamp, gesturePose} from './robot-state.mjs';

// Original, locally constructed character. No remote models, textures, or tracking.
export function createRobot(canvas, {onContextLost, compact = false, accent = 0xa8d7e9} = {}) {
  const renderer = new T.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(33, 1, .1, 30);
  camera.position.set(2.5, 2.65, 6.7);
  camera.lookAt(0, 1.45, 0);
  scene.add(new T.HemisphereLight(0xfffbf7, 0x7896ac, 2.05));
  const key = new T.DirectionalLight(0xfff6ea, 3.5); key.position.set(-3, 5, 6); scene.add(key);
  const rim = new T.DirectionalLight(0xcceefe, 2.4); rim.position.set(4, 3, -2); scene.add(rim);
  const fill = new T.DirectionalLight(0xf0dcff, 1.35); fill.position.set(-4, 1, -2); scene.add(fill);
  const cream = new T.MeshPhysicalMaterial({color: 0xfffaf4, roughness: .27, metalness: .015, clearcoat: .82});
  const sage = new T.MeshPhysicalMaterial({color: accent, roughness: .3, metalness: .08, clearcoat: .72});
  const dark = new T.MeshPhysicalMaterial({color: 0x29485e, roughness: .17, metalness: .14, clearcoat: 1});
  const eyeMat = new T.MeshBasicMaterial({color: 0x9fe6ff});
  const trim = new T.MeshStandardMaterial({color: 0xe7c4d9, roughness: .34, metalness: .13});
  const blush = new T.MeshBasicMaterial({color:0xf5bed2,transparent:true,opacity:.75});
  // A small procedural studio environment supplies soft reflections without remote textures.
  const studio=document.createElement('canvas');studio.width=512;studio.height=256;
  const studioCtx=studio.getContext('2d');
  const light=studioCtx.createLinearGradient(0,0,0,256);
  light.addColorStop(0,'#dff3fb');light.addColorStop(.46,'#fffaf5');light.addColorStop(1,'#98afc1');
  studioCtx.fillStyle=light;studioCtx.fillRect(0,0,512,256);
  studioCtx.fillStyle='#fffef5';studioCtx.fillRect(60,38,100,100);studioCtx.fillRect(350,53,42,90);
  const studioTexture=new T.CanvasTexture(studio);studioTexture.mapping=T.EquirectangularReflectionMapping;studioTexture.colorSpace=T.SRGBColorSpace;
  const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromEquirectangular(studioTexture);
  scene.environment=environment.texture;scene.environmentIntensity=.65;studioTexture.dispose();pmrem.dispose();
  const paper = new T.MeshStandardMaterial({color: 0xfffbef, roughness: .8});
  const mats = [cream, sage, dark, eyeMat, trim, blush, paper];
  const sphere = new T.SphereGeometry(1, 32, 24);
  const geometries = new Set([sphere]);
  function mesh(geometry, material, parent, position = [0,0,0], scale = [1,1,1]) {
    const m = new T.Mesh(geometry, material); m.position.set(...position); m.scale.set(...scale); parent.add(m); return m;
  }
  function ball(parent, material, p, s) { return mesh(sphere, material, parent, p, s); }
  function rounded(w, h, d, r = .12) {
    const shape = new T.Shape(), x = -w / 2 + r, y = -h / 2 + r;
    // Extrusion bevel gives the housing genuine rounded depth, including its back.
    const iw = w - r * 2, ih = h - r * 2, q = Math.min(r, iw / 2, ih / 2);
    shape.moveTo(x + q,y); shape.lineTo(x + iw - q,y); shape.quadraticCurveTo(x + iw,y,x + iw,y + q);
    shape.lineTo(x + iw,y + ih - q); shape.quadraticCurveTo(x + iw,y + ih,x + iw - q,y + ih);
    shape.lineTo(x + q,y + ih); shape.quadraticCurveTo(x,y + ih,x,y + ih - q);
    shape.lineTo(x,y + q); shape.quadraticCurveTo(x,y,x + q,y);
    const bevelDepth = Math.min(r, d * .45), depth = d - bevelDepth * 2;
    const g = new T.ExtrudeGeometry(shape,{depth, bevelEnabled: true, bevelSize: r, bevelThickness: bevelDepth, bevelSegments: 5, steps: 1, curveSegments: 8});
    g.translate(0,0,-depth / 2); g.computeVertexNormals(); geometries.add(g); return g;
  }
  const robot = new T.Group(); scene.add(robot);
  robot.rotation.y = -.1;
  ball(robot,cream,[0,1.06,0],[.61,.64,.49]);
  ball(robot,trim,[0,.99,.408],[.40,.29,.098]);
  ball(robot,eyeMat,[0,1.12,.502],[.039,.039,.012]);
  for (const x of [-.29,.29]) {
    ball(robot,dark,[x,.46,0],[.14,.21,.15]);
    ball(robot,sage,[x,.22,.12],[.27,.18,.37]);
    ball(robot,cream,[x,.28,.04],[.23,.13,.255]);
    mesh(rounded(.38,.065,.36,.022),trim,robot,[x,.095,.19]);
  }
  ball(robot,sage,[0,1.66,0],[.25,.17,.24]);
  const head = new T.Group(); head.position.set(0,2.03,0); robot.add(head);
  ball(head,cream,[0,0,0],[.81,.565,.54]);
  ball(head,sage,[0,-.005,.385],[.705,.438,.215]);
  ball(head,dark,[0,-.004,.425],[.652,.383,.20]);
  for (const x of [-.78,.78]) {
    ball(head,sage,[x,-.02,-.055],[.095,.224,.22]);
    ball(head,trim,[x*1.05,-.02,-.055],[.035,.139,.139]);
  }
  const eyes = new T.Group(); eyes.position.set(0,.045,.613); head.add(eyes);
  const glint=new T.MeshBasicMaterial({color:0xf1ffef});mats.push(glint);
  for (const x of [-.245,.245]) {
    ball(eyes,eyeMat,[x,0,0],[.108,.143,.028]);
    ball(eyes,glint,[x-.025,.05,.025],[.027,.038,.009]);
  }
  for (const x of [-.46,.46]) ball(head,blush,[x,-.14,.61],[.105,.055,.018]);
  const smileCurve = new T.QuadraticBezierCurve3(new T.Vector3(-.115,-.18,.601),new T.Vector3(0,-.265,.592),new T.Vector3(.115,-.18,.601));
  const smileGeo = new T.TubeGeometry(smileCurve,16,.016,8,false); geometries.add(smileGeo); mesh(smileGeo,eyeMat,head);
  ball(head,sage,[0,.63,-.05],[.04,.095,.04]);
  ball(head,trim,[0,.735,-.05],[.077,.077,.077]);
  // Small glass highlights are geometry, so they move with the head.
  const shine = new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.10}); mats.push(shine);
  ball(head,shine,[-.22,.237,.56],[.23,.025,.012]).rotation.z=.12;
  const arms = [];
  for (const side of [-1,1]) {
    const arm = new T.Group(); arm.position.set(side * .64,1.45,0); robot.add(arm);
    ball(arm,sage,[0,0,0],[.195,.2,.21]);
    ball(arm,cream,[0,-.27,0],[.18,.32,.19]);
    ball(arm,sage,[0,-.58,.015],[.19,.18,.19]);
    // A thumb makes each little mitten readable during a wave.
    ball(arm,sage,[-side * .15,-.54,.08],[.09,.12,.1]); arms.push(arm);
  }
  // A tiny heart badge and pastel folders keep the helper warm and playful.
  const heartShape = new T.Shape();
  heartShape.moveTo(0,-.10); heartShape.bezierCurveTo(-.28,-.28,-.39,.08,-.20,.20);
  heartShape.bezierCurveTo(-.08,.28,0,.18,0,.10); heartShape.bezierCurveTo(0,.18,.08,.28,.20,.20);
  heartShape.bezierCurveTo(.39,.08,.28,-.28,0,-.10);
  const heartGeo = new T.ExtrudeGeometry(heartShape,{depth:.035,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3});
  geometries.add(heartGeo); mesh(heartGeo,trim,robot,[0,1.03,.54],[.42,.42,.42]);
  const colors = [0xd8c6ef,0xf6c6d8,0xf6dda9];
  const folders = colors.map((color,i) => {
    const folder = new T.Group(); scene.add(folder);
    const material = new T.MeshStandardMaterial({color,roughness:.5,metalness:.06}); mats.push(material);
    mesh(rounded(.52,.66,.075,.025),material,folder);
    mesh(rounded(.17,.09,.075,.015),material,folder,[-.14,.35,0]);
    mesh(rounded(.39,.05,.012,.008),paper,folder,[0,.09,.046]);
    mesh(rounded(.27,.035,.012,.007),paper,folder,[-.055,-.005,.046]);
    return folder;
  });
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d'), grad = ctx.createRadialGradient(64,64,0,64,64,64);
  grad.addColorStop(0,'rgba(55,86,108,.24)'); grad.addColorStop(.45,'rgba(55,86,108,.10)'); grad.addColorStop(1,'rgba(55,86,108,0)');
  ctx.fillStyle=grad; ctx.fillRect(0,0,128,128);
  const shadowTexture = new T.CanvasTexture(shadowCanvas);
  const shadowMat = new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}); mats.push(shadowMat);
  const shadowGeo = new T.PlaneGeometry(3.7,2.6); geometries.add(shadowGeo);
  const shadow = mesh(shadowGeo,shadowMat,scene,[0,.01,0]); shadow.rotation.x=-Math.PI / 2;
  const lost = event => { event.preventDefault(); onContextLost?.(); };
  canvas.addEventListener('webglcontextlost',lost);
  let disposed = false;
  function resize() {
    const {width,height} = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix();
  }
  resize();
  return {
    resize,
    render(time, {kind = 'idle', started = 0, gaze = {x:0,y:0}} = {}) {
      if (disposed) return;
      const p = gesturePose(kind,time-started);
      robot.position.y=Math.sin(time*1.8)*.027;
      robot.rotation.z=Math.sin(time*1.15)*.013;
      head.rotation.y=clamp(gaze.x,-1,1)*.28+Math.sin(time*.6)*.025;
      head.rotation.x=clamp(gaze.y,-1,1)*.14;
      head.rotation.z=Math.sin(time*.85)*.035 + p.wave*.09;
      eyes.position.x=clamp(gaze.x,-1,1)*.035;
      const blink = time % 4.9;
      eyes.scale.y=blink < .16 ? .08 + .92 * Math.abs(blink-.08)/.08 : 1;
      arms[0].rotation.z=-.22+p.tidy*1.1-p.celebrate*1.55-p.think*.7; arms[0].rotation.x=-p.tidy*.75-p.celebrate*.35;
      arms[1].rotation.z=.22+p.wave*2.05+p.wiggle-p.tidy*1.1+p.celebrate*1.55+p.think*.45; arms[1].rotation.x=-.1-p.tidy*.75-p.celebrate*.35-p.think*.65;
      robot.position.y+=Math.abs(Math.sin(time*5))*p.celebrate*.10;
      robot.rotation.z+=Math.sin(time*8)*p.celebrate*.045;
      const scattered=[[-1.0,.65,.35],[1.08,1.0,-.1],[-1.04,1.85,-.22]];
      folders.forEach((folder,i) => {
        const a=scattered[i], t=p.tidy;
        folder.position.set(a[0]*(1-t)+(-.10+i*.10)*t,a[1]*(1-t)+(.90+i*.08)*t, a[2]*(1-t)+(.64+i*.045)*t);
        folder.position.y+=Math.sin(time*1.2+i)*.055*(1-t);
        folder.rotation.set(-.06*t,(.24-i*.25)*(1-t),(-.22+i*.22)*(1-t)-.10*t);
      });
      renderer.render(scene,camera);
    },
    dispose() {
      if (disposed) return; disposed=true; canvas.removeEventListener('webglcontextlost',lost);
      geometries.forEach(g=>g.dispose()); mats.forEach(m=>m.dispose()); shadowTexture.dispose(); environment.dispose(); renderer.dispose();
    },
  };
}
