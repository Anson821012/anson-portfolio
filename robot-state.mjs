export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const ease = value => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };

// A suspended tab must not accumulate animation time or duplicate frame loops.
export function createAnimationLoop({requestFrame, cancelFrame, render, fps = 45}) {
  let frame = null, running = false, previous = null, painted = null, time = 0;
  function tick(now) {
    if (!running) return;
    if (previous !== null) time += clamp((now - previous) / 1000, 0, .05);
    previous = now;
    if (painted === null || now - painted >= 1000 / fps) { render(time); painted = now; }
    if (running) frame = requestFrame(tick);
  }
  return {
    start() { if (running) return; running = true; previous = painted = null; frame = requestFrame(tick); },
    stop() { running = false; if (frame !== null) cancelFrame(frame); frame = null; previous = painted = null; },
    renderOnce() { render(time); },
    get time() { return time; },
  };
}

export function gesturePose(kind, elapsed) {
  if (kind === 'wave') {
    const envelope = ease(elapsed / .45) * (1 - ease((elapsed - 2.25) / .55));
    return {wave: envelope, wiggle: Math.sin(elapsed * 12) * .16 * envelope, tidy: 0};
  }
  return {wave: 0, wiggle: 0, tidy: kind === 'tidy' ? ease(elapsed / 1.3) : 0};
}
