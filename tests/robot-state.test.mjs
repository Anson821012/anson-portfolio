import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnimationLoop, gesturePose} from '../robot-state.mjs';

function clock(fps=30) {
  const pending=new Map(), renders=[]; let id=0;
  const loop=createAnimationLoop({fps,requestFrame:cb=>{pending.set(++id,cb);return id;},cancelFrame:id=>pending.delete(id),render:t=>renders.push(t)});
  const step=ms=>{ const entries=[...pending.values()]; pending.clear(); entries.forEach(cb=>cb(ms)); };
  return {loop,step,pending,renders};
}
test('visibility / pause suspension cancels work and resumes without a time jump',()=>{
  const {loop,step,pending,renders}=clock();
  loop.start(); loop.start(); assert.equal(pending.size,1);
  step(0); step(40); loop.stop();
  assert.equal(pending.size,0); assert.equal(loop.time,.04);
  step(40000); assert.equal(renders.length,2);
  loop.start(); step(80000); assert.equal(loop.time,.04);
  step(80040); assert.equal(loop.time,.08); loop.stop();
});
test('mobile frame budget skips paints while keeping animation time accurate',()=>{
  const {loop,step,renders}=clock(30); loop.start();
  for(let ms=0;ms<=96;ms+=16) step(ms);
  assert.equal(renders.length,3); assert.ok(Math.abs(loop.time-.096)<1e-8);
  loop.stop(); loop.renderOnce(); assert.equal(renders.length,4);
});
test('fallback inside a failed render never schedules another frame',()=>{
  let frame,queued=0;
  const loop=createAnimationLoop({requestFrame:cb=>{frame=cb;return ++queued;},cancelFrame:()=>{},render:()=>loop.stop()});
  loop.start(); frame(0); assert.equal(queued,1);
});
test('a wave eases back to neutral; sorting settles and stays sorted',()=>{
  assert.deepEqual(gesturePose('wave',-1),{wave:0,wiggle:0,tidy:0});
  assert.equal(gesturePose('wave',1).wave,1);
  assert.equal(gesturePose('wave',3).wave,0);
  assert.equal(gesturePose('tidy',0).tidy,0);
  assert.equal(gesturePose('tidy',.65).tidy,.5);
  assert.equal(gesturePose('tidy',20).tidy,1);
  assert.deepEqual(gesturePose('idle',99),{wave:0,wiggle:0,tidy:0});
});
