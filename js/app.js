import { CONFIG, MENU, TABLES, SALLE } from './data.js';

const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const prix = p => p.toFixed(2).replace('.', ',') + ' €';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ───────── barre ─────────
const barre = $('#barre');
const majBarre = () => barre.classList.toggle('pleine', scrollY > 40);
addEventListener('scroll', majBarre, { passive: true }); majBarre();

// ───────── carte ─────────
const onglets = $('#onglets'), plats = $('#plats'), fiche = $('#fiche');

function ouvrirFiche(it) {
  fiche.innerHTML = `
    <button class="fermer" aria-label="Fermer">✕</button>
    <div class="fiche-img ${it.img.endsWith('.webp') ? 'detoure' : 'photo'}"><img src="${it.img}" alt=""></div>
    <h3>${esc(it.nom)}</h3>
    ${it.desc ? `<p class="desc">${esc(it.desc)}</p>` : ''}
    <p class="prix">${prix(it.prix)}</p>`;
  fiche.querySelector('.fermer').onclick = () => fiche.close();
  fiche.showModal();
}
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

function afficher(cat) {
  [...onglets.children].forEach(b => { const on = b.dataset.id === cat.id; b.classList.toggle('actif', on); b.setAttribute('aria-selected', on); });
  plats.innerHTML = '';
  plats.className = 'plats ' + (cat.liste ? 'en-liste' : 'en-grille');
  if (cat.note) plats.append(el('p', 'note', esc(cat.note)));
  if (cat.liste) {
    const photo = el('div', 'liste-photo', `<img src="${cat.photo}" alt="${esc(cat.titre)}" loading="lazy">`);
    const ul = el('ul', 'liste');
    cat.items.forEach(it => ul.append(el('li', '', `<span class="n">${esc(it.nom)}${it.desc ? `<small>${esc(it.desc)}</small>` : ''}</span><span class="pts"></span><span class="p">${prix(it.prix)}</span>`)));
    plats.append(ul, photo);
    return;
  }
  cat.items.forEach((it, i) => {
    const c = el('button', 'plat ' + (it.img.endsWith('.webp') ? 'detoure' : 'photo'));
    c.type = 'button'; c.style.setProperty('--i', i);
    c.innerHTML = `
      <span class="visuel"><img src="${it.img}" alt="" loading="lazy"></span>
      ${it.badge ? `<span class="badge">${esc(it.badge)}</span>` : ''}
      <span class="nom">${esc(it.nom)}</span>
      ${it.desc ? `<span class="desc">${esc(it.desc)}</span>` : ''}
      <span class="prix">${prix(it.prix)}</span>`;
    c.onclick = () => ouvrirFiche(it);
    plats.append(c);
  });
}

MENU.forEach(cat => {
  const b = el('button', 'onglet', esc(cat.nom));
  b.type = 'button'; b.dataset.id = cat.id; b.setAttribute('role', 'tab');
  b.onclick = () => { afficher(cat); onglets.scrollTo({ left: b.offsetLeft - (onglets.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' }); };
  onglets.append(b);
});
afficher(MENU[0]);

// ───────── infos ─────────
const infos = [
  ['Adresse', CONFIG.adresse, CONFIG.adresse && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.nom + ' ' + CONFIG.adresse)}`, 'Itinéraire'],
  ['Horaires', CONFIG.horaires],
  ['Téléphone', CONFIG.telephone, CONFIG.telephone && 'tel:' + CONFIG.telephone.replace(/\s/g, ''), 'Appeler'],
];
infos.forEach(([titre, val, lien, action]) => {
  $('#cartes-infos').append(el('div', 'info', `<h3>${titre}</h3><p>${val ? esc(val).replace(/\n/g, '<br>') : '<span class="avenir">Bientôt en ligne</span>'}</p>${lien ? `<a href="${lien}" class="lien">${action} →</a>` : ''}`));
});

// ───────── réservation ─────────
const CLE = 'kpn-reservations';
const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { return []; } };
const ecrire = l => { try { localStorage.setItem(CLE, JSON.stringify(l)); } catch (e) {} };

const date = $('#date'), heure = $('#heure'), nb = $('#nb'), puces = $('#puces');
const finaliser = $('#finaliser'), recap = $('#recap');
const MAX = Math.max(...TABLES.map(t => t.places));
let convives = 2, salle = null, choix = null;

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const auj = new Date();
date.min = date.value = iso(auj);
CONFIG.creneaux.forEach(c => heure.append(new Option(c.replace(':', ' h '), c)));
heure.value = CONFIG.creneaux.find(c => c >= '19:00') || CONFIG.creneaux[0];
$('#demo').hidden = !CONFIG.demoOccupation;

function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) % 100; }
function etats() {
  const cle = date.value + ' ' + heure.value, miens = lire().filter(r => r.quand === cle).map(r => r.table);
  const e = {};
  TABLES.forEach(t => {
    const prise = miens.includes(t.id) || (CONFIG.demoOccupation && hash(cle + '#' + t.id) < 28);
    e[t.id] = prise ? 'prise' : t.places < convives ? 'petite' : 'libre';
  });
  return e;
}

function maj() {
  nb.textContent = convives;
  $('#moins').disabled = convives <= 1; $('#plus').disabled = convives >= MAX;
  const e = etats();
  if (choix && e[choix] !== 'libre') choix = null;
  if (salle) { salle.majEtats(e); salle.choisir(choix); }
  puces.innerHTML = '';
  TABLES.forEach(t => {
    const b = el('button', 'puce ' + e[t.id] + (t.id === choix ? ' choisie' : ''), `<b>Table ${t.id}</b><span>${e[t.id] === 'prise' ? 'réservée' : t.places + ' pers.'}</span>`);
    b.type = 'button'; b.disabled = e[t.id] !== 'libre'; b.setAttribute('aria-pressed', t.id === choix);
    b.onclick = () => choisir(t.id);
    puces.append(b);
  });
  finaliser.hidden = !choix;
  if (choix) {
    const t = TABLES.find(t => t.id === choix);
    const d = new Date(date.value + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    recap.innerHTML = `<b>Table ${t.id}</b> · ${convives} ${convives > 1 ? 'personnes' : 'personne'}<br>${d} à ${heure.value.replace(':', ' h ')}`;
  }
}
function choisir(id) {
  const avant = choix;
  choix = choix === id ? null : id;
  maj();
  if (choix && !avant && matchMedia('(max-width: 760px)').matches) finaliser.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

$('#moins').onclick = () => { convives = Math.max(1, convives - 1); maj(); };
$('#plus').onclick = () => { convives = Math.min(MAX, convives + 1); maj(); };
date.onchange = heure.onchange = maj;

finaliser.addEventListener('submit', e => {
  e.preventDefault();
  const t = TABLES.find(t => t.id === choix); if (!t) return;
  const nom = $('#nom').value.trim(), tel = $('#tel').value.trim(), mot = $('#mot').value.trim();
  const d = new Date(date.value + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const h = heure.value.replace(':', ' h ');
  ecrire([...lire(), { quand: date.value + ' ' + heure.value, table: t.id, convives, nom, tel, mot }]);
  const message = `Bonjour, je souhaite réserver chez ${CONFIG.nom} :\n• ${d} à ${h}\n• ${convives} personne${convives > 1 ? 's' : ''}\n• Table ${t.id}\n• Nom : ${nom}\n• Téléphone : ${tel}${mot ? `\n• Note : ${mot}` : ''}`;
  const dlg = $('#confirmation');
  dlg.innerHTML = `
    <button class="fermer" aria-label="Fermer">✕</button>
    <div class="coche" aria-hidden="true">✓</div>
    <h3>${CONFIG.whatsapp ? 'Dernière étape' : 'Demande enregistrée'}</h3>
    <p class="desc"><b>Table ${t.id}</b> · ${convives} personne${convives > 1 ? 's' : ''}<br>${d} à ${h}<br>Au nom de ${esc(nom)}</p>
    ${CONFIG.whatsapp
      ? `<a class="btn btn-or" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}">Envoyer sur WhatsApp</a><p class="mini">Votre table est confirmée dès que le restaurant vous répond.</p>`
      : `<p class="mini">Site en démonstration : la demande n’est pas encore transmise au restaurant.</p>`}`;
  dlg.querySelector('.fermer').onclick = () => dlg.close();
  dlg.showModal();
  choix = null; finaliser.reset(); maj();
});

maj();

// la 3D est chargée seulement quand la section approche de l'écran
const scene = $('#scene');
new IntersectionObserver(async (entrees, obs) => {
  if (!entrees[0].isIntersecting) return;
  obs.disconnect();
  try {
    const { creerSalle } = await import('./salle.js');
    salle = creerSalle(scene, TABLES, SALLE, {
      onChoix: (id, etat) => { if (etat === 'libre') choisir(id); },
    });
    scene.classList.add('prete'); maj();
  } catch (err) {
    console.error(err);
    scene.classList.add('sans-3d');
    scene.textContent = 'La vue 3D n’est pas disponible sur cet appareil : choisissez votre table dans la liste ci-dessous.';
  }
}, { rootMargin: '600px' }).observe(scene);
