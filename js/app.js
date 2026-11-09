import { CONFIG, MENU } from './data.js';

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

// ───────── avis ─────────
// Sans serveur, les avis sont gardés dans le navigateur du visiteur (localStorage).
const CLE = 'kpn-avis';
const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { return []; } };
const ecrire = l => { try { localStorage.setItem(CLE, JSON.stringify(l)); } catch (e) {} };
const etoiles = n => `<span class="stars" role="img" aria-label="${n} sur 5">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;

const liste = $('#avis-liste'), formAvis = $('#avis-form'), retour = $('#avis-retour');
$('#avis-note').hidden = !CONFIG.avisLocaux;

function afficherAvis() {
  const avis = lire();
  if (!avis.length) {
    liste.innerHTML = '<div class="vide"><b>Aucun avis pour l’instant</b>Soyez le premier à partager votre expérience.</div>';
    return;
  }
  const moy = avis.reduce((s, a) => s + a.note, 0) / avis.length;
  liste.innerHTML = `<div class="bilan"><span class="moy">${moy.toFixed(1).replace('.', ',')}</span><div>${etoiles(Math.round(moy))}<small>${avis.length} avis</small></div></div>`
    + avis.map(a => `
    <article class="un-avis">
      <header>
        <span class="pastille" aria-hidden="true">${esc(a.nom.charAt(0).toUpperCase())}</span>
        <span class="qui"><b>${esc(a.nom)}</b><time datetime="${esc(a.date)}">${new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</time></span>
        ${etoiles(a.note)}
      </header>
      <p>${esc(a.texte)}</p>
    </article>`).join('');
}

formAvis.addEventListener('submit', e => {
  e.preventDefault();
  const nom = $('#avis-nom').value.trim(), texte = $('#avis-texte').value.trim();
  const note = Number(new FormData(formAvis).get('note'));
  retour.className = 'erreur';
  if (!note) { retour.textContent = 'Choisissez une note en touchant les étoiles.'; return; }
  if (!nom || !texte) { retour.textContent = 'Indiquez votre nom et votre commentaire.'; return; }
  ecrire([{ nom, note, texte, date: new Date().toISOString() }, ...lire()]);
  formAvis.reset();
  retour.className = 'merci'; retour.textContent = 'Merci pour votre avis !';
  afficherAvis();
});
afficherAvis();
