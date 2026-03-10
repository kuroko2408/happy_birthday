/* script.js
 - Main interactions: GSAP intro timeline, starfield, gallery lightbox, floating hearts,
   quote popups, Three.js cake + candles, gift box opening + confetti, fireworks finale.
 - Replace images in /images and music in /music/background-music.mp3
 - Replace quotes in the HTML data-quote attributes or change in `quotes` array below.
*/

/* =========================
   Utilities & DOM binding
   ========================= */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initIntro();
  initGallery();
  initFloating();
  initThreeCake();
  initGiftBox();
  initFinale();
});

/* =========================
   Intro: cinematic text + music control
   ========================= */
function initIntro(){
  const lines = $$('.cinematic-text .line');
  const startBtn = $('#start-btn');
  const musicToggle = $('#music-toggle');
  const audio = $('#bg-music');

  // Intro GSAP timeline
  const tl = gsap.timeline({paused:true});
if (typeof gsap !== "undefined") {
   const tl = gsap.timeline({paused:true});
}
  lines.forEach((ln,i) => {
    tl.to(ln, {autoAlpha:1, y:0, duration:1, ease:"power3.out"}, i*0.8);
  });
  tl.to('#start-btn', {scale:1, autoAlpha:1, duration:0.8, ease:"back.out(1.2)"}, "+=0.2");

  // Start by placing them slightly below & hidden
  lines.forEach(ln => { gsap.set(ln, {y:20, autoAlpha:0}) });
  gsap.set('#start-btn', {scale:0.96, autoAlpha:0});

  // Play timeline
  tl.play();

  // Start button: plays music, advances to next scene (scroll)
  startBtn.addEventListener('click', () => {
    // toggle music play
    audio.play().catch(()=>console.log("user interaction required for autoplay")); $('#music-toggle').setAttribute('aria-pressed','true');

    // small cinematic flourish
    gsap.to(startBtn, {scale:0.92, duration:0.12, yoyo:true, repeat:1});
    // scroll to Memory Lane
    document.getElementById('memory-lane').scrollIntoView({behavior:'smooth'});
  });

  // music toggle
  musicToggle.addEventListener('click', () => {
    if(audio.paused){ audio.play(); musicToggle.setAttribute('aria-pressed','true') }
    else { audio.pause(); musicToggle.setAttribute('aria-pressed','false') }
  });
}

/* =========================
   Starfield background (canvas)
   ========================= */
function initStarfield(){
  const c = document.getElementById('starfield');
  if(!c) return;
  const ctx = c.getContext('2d');
  let stars = [];
  


  const STAR_COUNT = Math.min(380, Math.floor((c.width * c.height) / 12000));
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, {passive:true});
  function resizeCanvas(){
    c.width = innerWidth;
    c.height = innerHeight;
    initStars();
  }

  function initStars(){
    stars = [];
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random()*c.width,
        y: Math.random()*c.height,
        z: Math.random()*1.2 + 0.2,
        r: Math.random()*1.3
      });
    }
  }

  let t = 0;
  function frame(){
    t += 0.006;
    ctx.clearRect(0,0,c.width,c.height);
    // gradient overlay for subtle color
    const grd = ctx.createLinearGradient(0,0,c.width,c.height);
    grd.addColorStop(0,'rgba(255,220,235,0.02)');
    grd.addColorStop(1,'rgba(255,235,240,0.02)');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,c.width,c.height);

    for(const s of stars){
      const x = s.x + Math.sin(t + s.z*10) * 12 * s.z;
      const y = s.y + Math.cos(t*0.6 + s.z*5) * 8 * s.z;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.65 * s.z})`;
      ctx.arc(x,y, s.r * s.z, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
}

/* =========================
   Gallery: lightbox + hover caption
   ========================= */
function initGallery(){
  const gallery = $('#gallery');
  const lb = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbCaption = $('#lb-caption');

  $$('.gallery-item').forEach(item=>{
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('figcaption')?.textContent || '';
      lbImg.src = img.src;
      lbCaption.textContent = caption;
      lb.style.display = 'flex';
      lb.setAttribute('aria-hidden','false');
      gsap.fromTo(lb, {autoAlpha:0}, {autoAlpha:1, duration:0.4});
    });
  });

  $('#lb-close').addEventListener('click', closeLB);
  lb.addEventListener('click', (e)=>{ if(e.target === lb) closeLB(); });

  function closeLB(){
    gsap.to(lb, {autoAlpha:0, duration:0.25, onComplete: ()=>{ lb.style.display='none'; lb.setAttribute('aria-hidden','true') }});
  }
}

/* =========================
   Floating balloons & hearts
   ========================= */
function initFloating(){
  // create gentle floaters (balloons/hearts) using DOM elements and CSS transforms
  const stage = document.getElementById('float-stage');
  if(!stage) return;

  for(let i=0;i<14;i++){
    const el = document.createElement('div');
    el.className = 'floater';
    const size = 16 + Math.random()*36;
    el.style.position = 'absolute';
    el.style.left = `${Math.random()*90}%`;
    el.style.bottom = `${-Math.random()*60}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.pointerEvents = 'none';
    el.style.opacity = 0.85;
    el.style.borderRadius = '50%';
    el.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.92), rgba(255,255,255,0.12)), linear-gradient(180deg,#ffe6f0, #ffb3c7)`;
    stage.appendChild(el);
    // animate up
    gsap.to(el, {y: -420 - Math.random()*200, duration: 14 + Math.random()*18, repeat:-1, ease:"none", delay:Math.random()*6});
    gsap.to(el, {x: `+=${(Math.random()*120-60)}`, duration:6 + Math.random()*6, yoyo:true, repeat:-1, ease:"sine.inOut"});
  }

  // hearts open quotes
  $$('.heart').forEach(h=>{
    h.addEventListener('click', e=>{
      const q = h.dataset.quote || "You're my favorite story.";
      const popup = $('#quote-popup');
      $('#quote-text').textContent = q;
      popup.style.display = 'block';
      popup.setAttribute('aria-hidden','false');
      gsap.fromTo(popup, {scale:0.96, autoAlpha:0}, {scale:1, autoAlpha:1, duration:0.5, ease:'back.out(1.2)'});
    });
  });
  $('#close-quote').addEventListener('click', ()=>{
    const popup = $('#quote-popup');
    gsap.to(popup, {scale:0.98, autoAlpha:0, duration:0.25, onComplete:()=>{ popup.style.display='none'; popup.setAttribute('aria-hidden','true') }});
  });
}

/* =========================
   Three.js Cake with interactive candles
   ========================= */
function initThreeCake(){
  const container = document.getElementById('three-container');
  if(!container || typeof THREE === 'undefined') return;

  // Basic renderer + camera
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0710, 0.0035);

  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 4.2, 9);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);

  // Pedestal
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.6, 0.8, 48),
    new THREE.MeshStandardMaterial({color:0x22202a, metalness:0.2, roughness:0.38})
  );
  pedestal.position.y = -1;
  scene.add(pedestal);

  // Cake layers (3 stacked cylinders)
  const cakeGroup = new THREE.Group();
  const cakeMaterials = [
    new THREE.MeshStandardMaterial({color:0xffe6f1, roughness:0.6}),
    new THREE.MeshStandardMaterial({color:0xffcfe3, roughness:0.6}),
    new THREE.MeshStandardMaterial({color:0xffebf4, roughness:0.6})
  ];
  const layerHeights = [1.25, 1.0, 0.8];
  const layerRadii = [2.1, 1.6, 1.05];
  let y = 0;
  for(let i=0;i<3;i++){
    const geo = new THREE.CylinderGeometry(layerRadii[i], layerRadii[i], layerHeights[i], 64);
    const mesh = new THREE.Mesh(geo, cakeMaterials[i%cakeMaterials.length]);
    mesh.position.y = y + layerHeights[i]/2;
    cakeGroup.add(mesh);
    y += layerHeights[i];
  }
  cakeGroup.position.y = -0.4;
  scene.add(cakeGroup);

  // Candles positions around top layer
  const candles = [];
  const candleCount = 6;
  const topRadius = 1.05;
  for(let i=0;i<candleCount;i++){
    const ang = (i / candleCount) * Math.PI*2;
    const x = Math.cos(ang) * (topRadius * 0.7);
    const z = Math.sin(ang) * (topRadius * 0.7);
    // candle body
    const cBody = new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.36,16), new THREE.MeshStandardMaterial({color:0xffffff}));
    cBody.position.set(x, cakeGroup.position.y + y - 0.2, z);
    // wick (tiny)
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,0.06,8), new THREE.MeshStandardMaterial({color:0x111111}));
    wick.position.set(0,0.2,0);
    cBody.add(wick);
    cBody.userData = {lit:false, flame:null, light:null};
    // click handling via raycasting later
    candles.push(cBody);
    scene.add(cBody);
  }

  // Soft directional light (warm rim)
  const key = new THREE.DirectionalLight(0xffd6f0, 0.8);
  key.position.set(-4,8,6);
  scene.add(key);

  // subtle camera motion
  let clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    cakeGroup.rotation.y = Math.sin(t*0.15) * 0.06;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Resize handling
  window.addEventListener('resize', ()=> {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  // Raycaster for clicks to light candle
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  renderer.domElement.addEventListener('pointerdown', (evt)=>{
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(candles, true);
    if(intersects.length){
let candle = intersects[0].object;

while (!candles.includes(candle) && candle.parent) {
  candle = candle.parent;
}
      toggleCandle(candle);
    }
  });

  // toggle candle: create small point light + sprite flame
  function toggleCandle(candle){
    if(candle.userData.lit) return;
    // flame: small sprite approximated by a sphere emissive
    const flameMat = new THREE.MeshBasicMaterial({color:0xfff0b2});
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.07,8,8), flameMat);
    flame.position.set(0,0.22,0);
    candle.add(flame);

    // add subtle point light
    const pl = new THREE.PointLight(0xffcc66, 0.9, 3);
    pl.position.set(0,0.22,0);
    candle.add(pl);

    // small flicker using GSAP
    candle.userData.lit = true;
    candle.userData.flame = flame;
    candle.userData.light = pl;
    gsap.to(pl, {intensity:1.3, duration:0.12, yoyo:true, repeat:5});
    // gentle scale for flame
    gsap.to(flame.scale, {x:1.0,y:1.0,z:1.0, duration:0.2, from:{x:0.3,y:0.3,z:0.3}, ease:'elastic.out(1,0.6)'});

    // check all lit
    const allLit = candles.every(c=>c.userData.lit);
    if(allLit){
      celebrateCandles();
    }
  }

  function celebrateCandles(){
    // magical glow: add point light in center and bloom-like animated mesh
    const glow = new THREE.PointLight(0xff99cc, 0.16, 20);
    glow.position.set(0, y/2, 0);
    scene.add(glow);

    // soft halo using transparent sphere
    const halo = new THREE.Mesh(new THREE.SphereGeometry(2.4,32,32), new THREE.MeshBasicMaterial({color:0xffcfe8, transparent:true, opacity:0.06}));
    halo.position.set(0, cakeGroup.position.y + 0.8, 0);
    scene.add(halo);

    gsap.to(halo.material, {opacity:0.12, duration:0.9, yoyo:true, repeat:3});
    // trigger confetti and gift reveal
    triggerConfetti();
    // small camera pop
    gsap.to(camera.position, {z:7, duration:0.9, ease:'power2.out', onComplete: ()=>{ gsap.to(camera.position, {z:9, duration:1.6, ease:'power2.inOut'}) }});
  }

  /* Confetti: simple DOM-based bursts (fast and friendly) */
  function triggerConfetti(){
    for(let i=0;i<40;i++){
      const d = document.createElement('div');
      d.className = 'confetti';
      d.style.position='fixed';
      d.style.left=`${50+ (Math.random()*240-120)}%`;
      d.style.top=`${40+Math.random()*40}%`;
      d.style.width='8px';
      d.style.height='12px';
      d.style.borderRadius='2px';
      d.style.background = (['#ff6b9a','#ffd166','#f6b3ff','#ffc4d6'][Math.floor(Math.random()*4)]);
      d.style.zIndex=999;
      document.body.appendChild(d);
      gsap.to(d, {y:'-120vh', rotation: Math.random()*720, duration: 2 + Math.random()*2.4, ease:'power3.in', onComplete: ()=>d.remove()});
    }
  }
}

/* =========================
   Gift box open + confetti + surprise text
   ========================= */
function initGiftBox(){
  const box = $('#gift-box');
  const surprise = $('#surprise-text');

  let opened = false;
  box.addEventListener('click', openBox);
  box.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') openBox(); });

  function openBox(){
    if(opened) return;
    opened = true;
    gsap.to(box, {scale:0.98, duration:0.08, yoyo:true, repeat:1});
    // box lid "open" mimic by rotation and gradient shift
    gsap.to(box, {rotationX: -18, duration: 0.6, ease:'back.out(1.2)'});
    box.style.transformStyle = 'preserve-3d';
    // confetti burst function (canvas-party)
    burstConfettiAtElement(box);

    // show surprise text
    surprise.style.display='block';
    gsap.fromTo(surprise, {y:12, autoAlpha:0}, {y:0, autoAlpha:1, duration:0.9, ease:'power3.out'});
  }

  function burstConfettiAtElement(el){
    for(let i=0;i<60;i++){
      const d = document.createElement('div');
      d.style.position='absolute';
      d.style.left= (el.getBoundingClientRect().left + el.getBoundingClientRect().width/2) + (Math.random()*140-70) + 'px';
      d.style.top= (el.getBoundingClientRect().top + el.getBoundingClientRect().height/2) + (Math.random()*60-30) + 'px';
      d.style.width='8px';
      d.style.height='10px';
      d.style.borderRadius='2px';
      d.style.zIndex=9999;
      d.style.background = (['#ff6b9a','#ffd166','#f6b3ff','#ffc4d6'][Math.floor(Math.random()*4)]);
      document.body.appendChild(d);
      gsap.to(d, {x: Math.random()*200-100, y: - (200 + Math.random()*420), rotation: Math.random()*720, duration: 1.2 + Math.random()*1.4, ease:'power2.out', onComplete: ()=>d.remove()});
    }
  }
}

/* =========================
   Finale: fireworks canvas
   ========================= */
function initFinale(){
  const canvas = document.getElementById('fireworks');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize, {passive:true});

  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }

  const particles = [];
  function spawnFirework(x,y){
    const hue = Math.random()*360;
    for(let i=0;i<120;i++){
      particles.push({
        x:x, y:y,
        vx: (Math.random()*6-3) * (Math.random()*1.8),
        vy: (Math.random()*-6 + Math.random()*2),
        life: 60 + Math.random()*40,
        hue:hue,
        size: 1 + Math.random()*2
      });
    }
  }

  // periodic fireworks
  setInterval(()=> {
    spawnFirework(Math.random()*canvas.width*0.9 + canvas.width*0.05, Math.random()*canvas.height*0.45 + canvas.height*0.05);
  }, 900);

  function frame(){
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(7,5,10,0.28)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.life--;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${Math.max(0, p.life/100)})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      if(p.life <= 0) particles.splice(i,1);
    }
    requestAnimationFrame(frame);
  }
  frame();

  // replay button to re-run ceremonies
  $('#replay-btn').addEventListener('click', ()=>{
    // scroll to top and reset interactions
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    location.reload();
  });
}
