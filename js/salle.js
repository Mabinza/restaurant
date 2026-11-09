// Salle 3D interactive — Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

const C = {
  fond: 0x1d070b, bordeaux: 0x6b1b28, bordeauxSombre: 0x3d0e16, or: 0xd9a441,
  bois: 0x2a1a14, boisClair: 0x5a3a26, velours: 0x8a2433, gris: 0x4a4042, creme: 0xf3eadb,
};

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function texSol() {
  const t = canvasTex(512, 512, (g, w, h) => {
    const n = 4, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = 34 + ((i * 7 + j * 13) % 5) * 3;
      g.fillStyle = `rgb(${v + 22},${v + 4},${v - 4})`; g.fillRect(i * s, j * s, s, s);
      g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 3; g.strokeRect(i * s, j * s, s, s);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 3);
  return t;
}

function texTapis() {
  return canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#7a1420'; g.fillRect(0, 0, w, h);
    const bande = (m, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.strokeRect(m, m, w - 2 * m, h - 2 * m); };
    bande(10, '#1b1420', 20); bande(34, '#e8d3a2', 6); bande(52, '#1b1420', 10);
    // frise de triangles
    g.fillStyle = '#d9a441';
    for (let x = 70; x < w - 70; x += 28) {
      g.beginPath(); g.moveTo(x, 66); g.lineTo(x + 14, 84); g.lineTo(x + 28, 66); g.fill();
      g.beginPath(); g.moveTo(x, h - 66); g.lineTo(x + 14, h - 84); g.lineTo(x + 28, h - 66); g.fill();
    }
    // médaillons (gul)
    const gul = (cx, cy, r) => {
      const los = (k, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(cx, cy - r * k); g.lineTo(cx + r * k * 1.25, cy); g.lineTo(cx, cy + r * k); g.lineTo(cx - r * k * 1.25, cy); g.closePath(); g.fill(); };
      los(1, '#1b1420'); los(.82, '#e8d3a2'); los(.64, '#9c1c2b'); los(.4, '#1b1420'); los(.2, '#d9a441');
    };
    for (let i = 0; i < 4; i++) gul(180 + i * 221, h / 2, 96);
    for (let i = 0; i < 3; i++) { gul(290 + i * 221, 140, 30); gul(290 + i * 221, h - 140, 30); }
  });
}

function texMur(nom) {
  return canvasTex(2048, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#7a2030'); gr.addColorStop(1, '#4f131d');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // niches en arc
    const arc = (cx, lw, hh) => {
      const b = h - 70, x0 = cx - lw / 2, x1 = cx + lw / 2, t = b - hh;
      g.beginPath(); g.moveTo(x0, b); g.lineTo(x0, t + lw * .45);
      g.quadraticCurveTo(x0, t + lw * .05, cx, t); g.quadraticCurveTo(x1, t + lw * .05, x1, t + lw * .45);
      g.lineTo(x1, b); g.closePath();
    };
    [200, 520, 1528, 1848].forEach(cx => {
      arc(cx, 200, 330); g.fillStyle = 'rgba(30,6,10,.55)'; g.fill();
      g.strokeStyle = '#d9a441'; g.lineWidth = 7; g.stroke();
      arc(cx, 160, 296); g.strokeStyle = 'rgba(217,164,65,.45)'; g.lineWidth = 3; g.stroke();
    });
    // enseigne
    g.textAlign = 'center'; g.fillStyle = '#e3b458';
    g.font = '600 120px Cinzel, Georgia, serif';
    try { g.letterSpacing = '26px'; } catch (e) {}
    g.fillText('KABOUL', w / 2, 230);
    g.font = '500 46px Cinzel, Georgia, serif';
    try { g.letterSpacing = '18px'; } catch (e) {}
    g.fillText('PARIS NORD', w / 2, 305);
    g.fillRect(w / 2 - 330, 276, 110, 4); g.fillRect(w / 2 + 220, 276, 110, 4);
    // plinthe + frise dorée
    g.fillStyle = '#2a0a10'; g.fillRect(0, h - 70, w, 70);
    g.fillStyle = '#d9a441'; g.fillRect(0, h - 76, w, 6); g.fillRect(0, 26, w, 5);
  });
}

function etiquette() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 160;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true });
  const s = new THREE.Sprite(m); s.scale.set(1.3, .81, 1); s.renderOrder = 10;
  s.userData.dessiner = (num, places, etat) => {
    const g = c.getContext('2d'); g.clearRect(0, 0, 256, 160);
    const st = {
      libre: ['rgba(29,7,11,.88)', '#d9a441', '#f3eadb'],
      choisie: ['#d9a441', '#fff3cf', '#1d070b'],
      prise: ['rgba(40,34,36,.85)', '#6b6064', '#8f8589'],
      petite: ['rgba(40,34,36,.6)', '#5a5054', '#857b7f'],
    }[etat];
    g.beginPath(); g.roundRect(18, 14, 220, 116, 58); g.fillStyle = st[0]; g.fill();
    g.lineWidth = 6; g.strokeStyle = st[1]; g.stroke();
    g.beginPath(); g.moveTo(112, 130); g.lineTo(128, 152); g.lineTo(144, 130); g.fillStyle = st[1]; g.fill();
    g.textAlign = 'center'; g.fillStyle = st[2];
    g.font = '700 58px Jost, Arial, sans-serif'; g.fillText(etat === 'prise' ? '✕' : 'T' + num, 128, 76);
    g.font = '500 28px Jost, Arial, sans-serif';
    g.fillText(etat === 'prise' ? 'réservée' : places + ' pers.', 128, 112);
    t.needsUpdate = true;
  };
  return s;
}

export function creerSalle(conteneur, tables, dims, { onChoix } = {}) {
  const W = dims.largeur, D = dims.profondeur, H = 3.3;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  conteneur.appendChild(renderer.domElement);

  const scene = new THREE.Scene(); scene.background = new THREE.Color(C.fond);
  const cam = new THREE.PerspectiveCamera(38, 1, .1, 120);
  const cible = new THREE.Vector3(0, .6, -.3);

  // lumières
  scene.add(new THREE.HemisphereLight(0xffe2c0, 0x2a0a10, 1.25));
  const soleil = new THREE.DirectionalLight(0xffe6c4, 2.1);
  soleil.position.set(5, 12, 9); soleil.castShadow = true;
  soleil.shadow.mapSize.set(1536, 1536); soleil.shadow.bias = -0.0004; soleil.shadow.radius = 4;
  Object.assign(soleil.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
  scene.add(soleil);
  [[-3.5, 2.7, 0], [3.5, 2.7, 0]].forEach(p => { const l = new THREE.PointLight(0xffb060, 26, 14, 2); l.position.set(...p); scene.add(l); });

  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .8, ...o });
  const mBois = mat(C.bois, { roughness: .55 }), mOr = mat(C.or, { roughness: .3, metalness: .85 });
  const mMur = mat(C.bordeaux, { roughness: .95 }), mCreme = mat(C.creme, { roughness: .6 });
  const box = (w, h, d, m, x, y, z, parent = scene, ombre = true) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z);
    o.castShadow = ombre; o.receiveShadow = true; parent.add(o); return o;
  };
  const cyl = (rt, rb, h, m, x, y, z, parent = scene, seg = 28) => {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z);
    o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
  };

  // sol, socle, tapis
  box(W + .4, .4, D + .4, mat(0x14060a), 0, -.2, 0, scene, false);
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(0xffffff, { map: texSol(), roughness: .7 }));
  sol.rotation.x = -Math.PI / 2; sol.position.y = .002; sol.receiveShadow = true; scene.add(sol);
  const tapis = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 3.2), mat(0xffffff, { map: texTapis(), roughness: 1 }));
  tapis.rotation.x = -Math.PI / 2; tapis.position.set(-.3, .012, -.2); tapis.receiveShadow = true; scene.add(tapis);

  // murs
  const fondMur = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat(0xffffff, { map: texMur(), roughness: .95 }));
  fondMur.position.set(0, H / 2, -D / 2 + .001); fondMur.receiveShadow = true; scene.add(fondMur);
  box(W + .4, H, .2, mMur, 0, H / 2, -D / 2 - .1, scene, false);
  [-1, 1].forEach(s => {
    box(.2, H, D + .2, mMur, s * (W / 2 + .1), H / 2, -.1, scene, false);
    box(.04, .06, D, mOr, s * (W / 2 - .02), 1.05, 0, scene, false);
    box(.04, .05, D, mOr, s * (W / 2 - .02), H - .2, 0, scene, false);
    box(.06, .45, D, mat(C.bordeauxSombre), s * (W / 2 - .03), .225, 0, scene, false);
    // cadres décoratifs
    [-2.4, 1.2].forEach(z => {
      box(.05, 1.3, 1.0, mOr, s * (W / 2 - .03), 2.0, z, scene, false);
      box(.06, 1.14, .84, mat(C.bordeauxSombre), s * (W / 2 - .04), 2.0, z, scene, false);
    });
  });

  // comptoir + tandoor
  const bx = W / 2 - 2.3, bz = -D / 2 + 1.25;
  box(3.6, 1.05, .8, mBois, bx, .525, bz);
  box(3.76, .07, .96, mOr, bx, 1.085, bz);
  box(3.6, .5, .05, mat(C.bordeaux), bx, .6, bz + .43, scene, false);
  cyl(.42, .5, .95, mat(0x9a5a38, { roughness: 1 }), W / 2 - .85, .475, -D / 2 + .7);
  cyl(.3, .3, .04, mat(0x120806), W / 2 - .85, .96, -D / 2 + .7);
  [-1, 0, 1].forEach(i => { cyl(.09, .11, .26, mOr, bx + i * .9 - .3, 1.25, bz - .1); });

  // plantes
  [[-W / 2 + .6, D / 2 - .6], [W / 2 - .6, D / 2 - .6]].forEach(([x, z]) => {
    cyl(.26, .2, .5, mat(0x1a1012), x, .25, z);
    const f = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), mat(0x2f5a34, { roughness: 1, flatShading: true }));
    f.position.set(x, 1.05, z); f.scale.y = 1.35; f.castShadow = true; scene.add(f);
  });

  // ── tables ──────────────────────────────────────────────
  const zones = [], objets = new Map();
  const gAssiette = new THREE.CylinderGeometry(.13, .11, .02, 20);

  tables.forEach(t => {
    const g = new THREE.Group(); g.position.set(t.x, 0, t.z); scene.add(g);
    const mChaise = mat(C.velours, { roughness: .9 });
    const sieges = [];
    let rayon;
    if (t.forme === 'ronde') {
      cyl(.56, .56, .06, mBois, 0, .75, 0, g, 36); cyl(.58, .58, .02, mOr, 0, .715, 0, g, 36);
      cyl(.06, .06, .7, mBois, 0, .36, 0, g, 12); cyl(.28, .3, .04, mBois, 0, .02, 0, g, 24);
      sieges.push([-.88, 0], [.88, 0]); rayon = 1.3;
    } else {
      const n = t.places / 2, L = n === 3 ? 1.9 : 1.25, l = .82;
      box(L, .06, l, mBois, 0, .75, 0, g); box(L + .04, .02, l + .04, mOr, 0, .715, 0, g);
      [-1, 1].forEach(s => box(.08, .7, l - .2, mBois, s * (L / 2 - .18), .36, 0, g));
      for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * .6; sieges.push([x, -.72], [x, .72]); }
      rayon = L / 2 + .55;
    }
    sieges.forEach(([x, z]) => {
      const ch = new THREE.Group(); ch.position.set(x, 0, z);
      ch.rotation.y = t.forme === 'ronde' ? Math.atan2(x, z) : (z > 0 ? 0 : Math.PI);
      box(.44, .44, .42, mChaise, 0, .22, 0, ch); box(.44, .46, .08, mChaise, 0, .66, .2, ch);
      g.add(ch);
      const k = t.forme === 'ronde' ? .38 : .34, d = Math.hypot(x, z);
      const a = new THREE.Mesh(gAssiette, mCreme);
      a.position.set(t.forme === 'ronde' ? x / d * k : x, .79, t.forme === 'ronde' ? 0 : Math.sign(z) * .25); g.add(a);
    });
    // suspension
    cyl(.008, .008, H - 2.45, mat(0x0a0405), 0, (H + 2.45) / 2, 0, g, 6).castShadow = false;
    const lampe = new THREE.Mesh(new THREE.SphereGeometry(.17, 20, 14, 0, Math.PI * 2, 0, Math.PI * .62),
      new THREE.MeshStandardMaterial({ color: C.or, metalness: .8, roughness: .3, emissive: 0xffa040, emissiveIntensity: .55, side: THREE.DoubleSide }));
    lampe.position.y = 2.35; g.add(lampe);
    // anneau au sol
    const anneau = new THREE.Mesh(new THREE.RingGeometry(rayon - .08, rayon, 56),
      new THREE.MeshBasicMaterial({ color: C.or, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    anneau.rotation.x = -Math.PI / 2; anneau.position.y = .03; g.add(anneau);
    const disque = new THREE.Mesh(new THREE.CircleGeometry(rayon - .08, 56),
      new THREE.MeshBasicMaterial({ color: C.or, transparent: true, opacity: 0, depthWrite: false }));
    disque.rotation.x = -Math.PI / 2; disque.position.y = .025; g.add(disque);
    // étiquette + zone cliquable
    const et = etiquette(); et.position.set(0, 1.75, 0); g.add(et);
    const zone = new THREE.Mesh(new THREE.CylinderGeometry(rayon, rayon, 1.5, 16), new THREE.MeshBasicMaterial({ visible: false }));
    zone.position.y = .75; zone.userData.id = t.id; g.add(zone); zones.push(zone);
    objets.set(t.id, { t, g, et, anneau, disque, mChaise, etat: 'libre', y: 0 });
  });

  // ── états ───────────────────────────────────────────────
  let choisie = null, survol = null;
  function appliquer(o) {
    const etat = o.t.id === choisie ? 'choisie' : o.etat;
    o.et.userData.dessiner(o.t.id, o.t.places, etat);
    o.mChaise.color.set(etat === 'prise' || etat === 'petite' ? C.gris : etat === 'choisie' ? 0xb8862f : C.velours);
    o.anneau.material.opacity = etat === 'choisie' ? 1 : etat === 'libre' ? .35 : 0;
    o.disque.material.opacity = etat === 'choisie' ? .22 : 0;
  }
  const api = {
    // etats : { [id]: 'libre' | 'prise' | 'petite' }
    majEtats(etats) {
      objets.forEach(o => { o.etat = etats[o.t.id] || 'libre'; });
      if (choisie && objets.get(choisie).etat !== 'libre') choisie = null;
      objets.forEach(appliquer); return choisie;
    },
    choisir(id) {
      const o = objets.get(id);
      choisie = (o && o.etat === 'libre') ? id : null;
      objets.forEach(appliquer); return choisie;
    },
    get choix() { return choisie; },
    redessiner() { objets.forEach(appliquer); },
  };
  objets.forEach(appliquer);

  // ── contrôles ───────────────────────────────────────────
  const ctrl = new OrbitControls(cam, renderer.domElement);
  ctrl.target.copy(cible); ctrl.enablePan = false; ctrl.enableDamping = true; ctrl.dampingFactor = .08;
  ctrl.minPolarAngle = .25; ctrl.maxPolarAngle = 1.22; ctrl.minAzimuthAngle = -.85; ctrl.maxAzimuthAngle = .85;
  ctrl.rotateSpeed = .6; ctrl.zoomSpeed = .7;

  let distBase = 20;
  function cadrer() {
    const w = conteneur.clientWidth, h = conteneur.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h); cam.aspect = w / h;
    const tv = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    distBase = Math.max((W / 2 + .9) / (tv * cam.aspect), (D / 2 + 1.6) / tv * .9);
    ctrl.minDistance = distBase * .45; ctrl.maxDistance = distBase * 1.15;
    const dir = cam.position.clone().sub(ctrl.target);
    if (dir.lengthSq() < .01) dir.set(0, .8, 1);
    cam.position.copy(ctrl.target).add(dir.normalize().multiplyScalar(distBase));
    cam.updateProjectionMatrix();
  }
  cam.position.set(0, .82, 1).add(cible); cadrer();
  new ResizeObserver(cadrer).observe(conteneur);

  // ── clic / survol ───────────────────────────────────────
  const ray = new THREE.Raycaster(), souris = new THREE.Vector2();
  const viser = e => {
    const r = renderer.domElement.getBoundingClientRect();
    souris.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(souris, cam);
    const hit = ray.intersectObjects(zones)[0];
    return hit ? hit.object.userData.id : null;
  };
  let bas = null;
  const el = renderer.domElement;
  el.addEventListener('pointerdown', e => { bas = [e.clientX, e.clientY]; });
  el.addEventListener('pointerup', e => {
    if (!bas || Math.hypot(e.clientX - bas[0], e.clientY - bas[1]) > 8) return;
    const id = viser(e); if (id == null) return;
    const o = objets.get(id);
    if (onChoix) onChoix(id, o.etat);
  });
  el.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    survol = viser(e);
    el.style.cursor = survol && objets.get(survol).etat === 'libre' ? 'pointer' : 'grab';
  });
  el.addEventListener('pointerleave', () => { survol = null; });

  // ── boucle ──────────────────────────────────────────────
  let visible = false, t0 = performance.now(), intro = 0;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: .05 }).observe(conteneur);
  function boucle(now) {
    requestAnimationFrame(boucle);
    if (!visible) { t0 = now; return; }
    const dt = Math.min((now - t0) / 1000, .05); t0 = now;
    if (intro < 1) { // léger travelling d'arrivée
      intro = Math.min(1, intro + dt / 1.8);
      const k = 1 - Math.pow(1 - intro, 3);
      const az = (1 - k) * .7, pol = .62 + (1 - k) * .35;
      cam.position.set(Math.sin(az) * Math.sin(pol), Math.cos(pol), Math.cos(az) * Math.sin(pol))
        .multiplyScalar(distBase * (1.12 - .12 * k)).add(ctrl.target);
    }
    objets.forEach(o => {
      const haut = o.t.id === choisie ? .16 : (o.t.id === survol && o.etat === 'libre' ? .07 : 0);
      o.y += (haut - o.y) * Math.min(1, dt * 10); o.g.position.y = o.y;
      if (o.t.id === choisie) o.anneau.material.opacity = .7 + .3 * Math.sin(now / 260);
    });
    ctrl.update(); renderer.render(scene, cam);
  }
  requestAnimationFrame(boucle);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => api.redessiner());
  return api;
}
