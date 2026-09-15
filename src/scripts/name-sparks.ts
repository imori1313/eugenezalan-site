// A small, event-driven overlay. No animation runs while the names are idle.
const names = document.querySelectorAll<HTMLElement>('[data-name-sparks]');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
type Spark = { x: number; y: number; vx: number; vy: number; size: number; angle: number; spin: number; age: number; blue: boolean; shimmer: number };
let canvas: HTMLCanvasElement | undefined;
let context: CanvasRenderingContext2D | null = null;
let sparks: Spark[] = [];
let frame = 0;
let previous = 0;
let lastEmission = 0;

function resize() {
  if (!canvas || !context) return;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * ratio);
  canvas.height = Math.round(innerHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function draw(now: number) {
  if (!context) return;
  const dt = Math.min((now - previous) / 1000, .04);
  previous = now;
  context.clearRect(0, 0, innerWidth, innerHeight);
  // Keep each star until it has fallen completely past the viewport edge.
  sparks = sparks.filter(spark => spark.y - spark.size <= innerHeight);
  for (const spark of sparks) {
    spark.age += dt;
    spark.vy = Math.min(155, spark.vy + 48 * dt);
    spark.vx *= Math.exp(-.65 * dt);
    spark.x += spark.vx * dt;
    spark.y += spark.vy * dt;
    if (spark.x < spark.size || spark.x > innerWidth - spark.size) {
      spark.x = Math.max(spark.size, Math.min(innerWidth - spark.size, spark.x));
      spark.vx *= -.25;
    }
    spark.angle += spark.spin * dt;
    context.save();
    context.translate(spark.x, spark.y);
    context.rotate(spark.angle);
    // Fade by position, not age: stars melt only in the bottom third.
    const melt = Math.max(0, Math.min(1, (spark.y - innerHeight * .67) / (innerHeight * .33 + spark.size)));
    const fade = 1 - melt * melt * (3 - 2 * melt);
    const gleam = .8 + .2 * Math.sin(spark.age * 9 + spark.shimmer);
    context.globalAlpha = fade * gleam;
    const finish = context.createLinearGradient(-spark.size, -spark.size, spark.size, spark.size);
    if (spark.blue) {
      finish.addColorStop(0, '#f1fdff');
      finish.addColorStop(.3, '#7de6ff');
      finish.addColorStop(.48, '#efffff');
      finish.addColorStop(.65, '#278aff');
      finish.addColorStop(1, '#154de5');
    } else {
      finish.addColorStop(0, '#fff4bd');
      finish.addColorStop(.25, '#efb631');
      finish.addColorStop(.48, '#fff9d6');
      finish.addColorStop(.66, '#ffd34d');
      finish.addColorStop(1, '#af7015');
    }
    context.fillStyle = finish;
    context.shadowColor = spark.blue ? '#238cff' : '#ffd454';
    context.shadowBlur = spark.blue ? 16 : 9;
    context.beginPath();
    // Eight long rays, like the illustrated sunbursts in the reference.
    for (let point = 0; point < 16; point++) {
      const angle = point * Math.PI / 8 - Math.PI / 2;
      const radius = spark.size * (point % 2 ? .4 : point % 4 === 0 ? 1 : .82);
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (point === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.fill();
    // A tiny bright glint gives the metal a changing highlight as it rotates.
    const glint = spark.size * .16;
    context.translate(-spark.size * .16, -spark.size * .19);
    context.fillStyle = spark.blue ? '#f3ffff' : '#fffce8';
    context.globalAlpha = fade * (.5 + .5 * gleam);
    context.shadowBlur = spark.blue ? 10 : 5;
    context.beginPath();
    context.moveTo(0, -glint * 1.8);
    context.lineTo(glint * .3, -glint * .3);
    context.lineTo(glint * 1.3, 0);
    context.lineTo(glint * .3, glint * .3);
    context.lineTo(0, glint * 1.8);
    context.lineTo(-glint * .3, glint * .3);
    context.lineTo(-glint * 1.3, 0);
    context.lineTo(-glint * .3, -glint * .3);
    context.closePath();
    context.fill();
    context.restore();
  }
  frame = sparks.length ? requestAnimationFrame(draw) : 0;
}
function emit(event: PointerEvent, burst: boolean) {
  if (motionPreference.matches || document.hidden) return;
  const now = performance.now();
  if (!burst && now - lastEmission < 45) return;
  lastEmission = now;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'name-sparks';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);
    context = canvas.getContext('2d');
    resize();
  }
  if (!context) return;
  // At capacity, stop adding stars instead of removing ones still falling.
  const capacity = event.pointerType === 'touch' ? 48 : 80;
  const count = Math.min(burst ? 12 : 2, Math.max(0, capacity - sparks.length));
  for (let i = 0; i < count; i++) sparks.push({
    x: event.clientX + (Math.random() - .5) * 12,
    y: event.clientY + (Math.random() - .5) * 8,
    vx: (Math.random() - .5) * (burst ? 170 : 90),
    vy: Math.random() * 45 - (burst ? 65 : 5),
    size: 11 + Math.random() * 10,
    angle: Math.random() * Math.PI,
    spin: (Math.random() - .5) * 3,
    age: 0,
    blue: Math.random() < .4,
    shimmer: Math.random() * Math.PI * 2,
  });
  if (!frame) { previous = now; frame = requestAnimationFrame(draw); }
}
names.forEach(name => {
  name.addEventListener('pointermove', event => emit(event, false), { passive: true });
  name.addEventListener('pointerdown', event => emit(event, true), { passive: true });
});
function clear() {
  cancelAnimationFrame(frame);
  frame = 0;
  sparks = [];
  context?.clearRect(0, 0, innerWidth, innerHeight);
}
addEventListener('resize', resize, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
motionPreference.addEventListener('change', () => { if (motionPreference.matches) clear(); });
