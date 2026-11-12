import { CONFIG, MENU, DEFILE, VEDETTES, BONS_PLANS } from './data.js?v=202611121432';
import { LANGUE, CHOISIE, GLOSES, traduire, enAnglais, choisirLangue, installerLangue, pret } from './langue.js?v=202611121432';

// ───────── utilitaires ─────────
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const prix = p => p.toFixed(2).replace('.', ',') + ' €';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sansAccent = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/œ/g, 'oe');
const slug = s => sansAccent(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stock = {
  lire: (cle, defaut) => { try { return JSON.parse(localStorage.getItem(cle)) ?? defaut; } catch (e) { return defaut; } },
  ecrire: (cle, v) => { try { localStorage.setItem(cle, JSON.stringify(v)); } catch (e) {} },
};
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Chaque plat reçoit un identifiant et connaît sa catégorie.
const PLATS = new Map();
MENU.forEach(cat => cat.items.forEach(it => { it.id = slug(it.nom); it.cat = cat; PLATS.set(it.id, it); }));
const parNom = nom => PLATS.get(slug(nom));
// En anglais, une courte explication accompagne les plats peu connus.
if (LANGUE === 'en') PLATS.forEach(it => { if (!it.desc && GLOSES[it.nom]) it.desc = GLOSES[it.nom]; });
installerLangue();
const detoure = it => it.img?.endsWith('.webp');
// Version allégée de la photo (cartes, listes) ; la grande sert pour l'accueil et la fiche du plat.
const petite = it => it.img.replace('/plats/', '/plats/s/').replace(/\.\w+$/, '.webp');

let toastFin;
function toast(msg) {
  const t = $('#toast'); ($('dialog[open]') || document.body).append(t); t.textContent = msg; void t.offsetWidth; t.classList.add('vu');
  clearTimeout(toastFin); toastFin = setTimeout(() => t.classList.remove('vu'), 2200);
}

// ───────── barre ─────────
const barre = $('#barre');
const majBarre = () => barre.classList.toggle('pleine', scrollY > 40);
addEventListener('scroll', majBarre, { passive: true }); majBarre();

// ───────── accueil : les plats défilent ─────────
// Les animations en boucle se mettent en pause dès qu'elles sortent de l'écran.
const visibles = new Map();
const surveille = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  e.target.classList.toggle('hors-ecran', !e.isIntersecting);
  visibles.get(e.target)?.(e.isIntersecting);
})) : null;
const pauseHorsEcran = (elem, quand) => { if (quand) visibles.set(elem, quand); surveille?.observe(elem); };
{
  const scene = $('#defile'), legende = $('#defile-legende');
  const plats = DEFILE.map(parNom).filter(Boolean);
  const imgs = plats.map(() => { const img = el('img'); img.alt = ''; img.decoding = 'async'; scene.append(img); return img; });
  // On ne charge que l'image affichée et la suivante.
  const charger = n => { const k = (n + plats.length) % plats.length; if (!imgs[k].getAttribute('src')) imgs[k].src = plats[k].img; };
  let i = -1, minuteur, aLEcran = true;
  const montrer = n => {
    i = (n + plats.length) % plats.length;
    charger(i); charger(i + 1);
    imgs.forEach((im, k) => im.classList.toggle('actif', k === i));
    const it = plats[i];
    legende.innerHTML = `<span>${esc(it.nom.replace(/ \+ naan$/, ''))}</span><b>${prix(it.prix)}</b>`;
    legende.onclick = () => ouvrirFiche(it);
  };
  const lancer = () => { clearInterval(minuteur); if (!calme && plats.length > 1 && aLEcran && !document.hidden) minuteur = setInterval(() => montrer(i + 1), 4200); };
  montrer(0); lancer();
  document.addEventListener('visibilitychange', lancer);
  pauseHorsEcran($('#accueil'), vu => { aLEcran = vu; lancer(); });
  pauseHorsEcran($('.ruban'));
}

// ───────── ruban ─────────
{
  const noms = MENU.filter(c => c.id !== 'boissons').flatMap(c => c.items.map(it => it.nom.replace(/ \+.*$| \(.*$| \/.*$/g, '')));
  const uniques = [...new Set(noms)].filter(n => n.length < 22 && !/^\d/.test(n));
  const bloc = uniques.map(n => `<span>${esc(n)}</span><i>✦</i>`).join('');
  $('#ruban').innerHTML = bloc + bloc;
}

// ───────── atouts ─────────
$('#atout-nb').textContent = PLATS.size;
$('#atout-prix').textContent = prix(Math.min(...MENU.find(c => c.id === 'mijotes').items.filter(it => /naan/.test(it.nom)).map(it => it.prix))).replace(',00', '');

// ───────── incontournables ─────────
VEDETTES.forEach((v, n) => {
  const it = parNom(v.plat); if (!it) return;
  const bloc = el('article', 'vedette rv' + (n % 2 ? ' inverse' : ''), `
    <div class="vedette-img ${v.cadre ? 'cadre' : 'detoure'}"><img src="${v.img || it.img}" alt="${esc(v.titre || it.nom)}" loading="lazy"></div>
    <div class="vedette-texte">
      <p class="sur">${esc(v.sur)}</p>
      <h3>${esc(v.titre || it.nom)}</h3>
      <p>${esc(v.texte)}</p>
      <div class="vedette-bas">
        <span class="prix">${v.prix ? esc(v.prix) : prix(it.prix)}</span>
        <a class="lien" href="#c-${it.cat.id}">Voir sur la carte →</a>
      </div>
    </div>`);
  $('#vedettes').append(bloc);
});

// ───────── bons plans ─────────
BONS_PLANS.map(parNom).filter(Boolean).forEach(it => {
  const c = el('button', 'plan-carte ' + (detoure(it) ? 'detoure' : 'photo'), `
    <span class="visuel"><img src="${petite(it)}" alt="" loading="lazy" decoding="async"></span>
    <span class="nom">${esc(it.nom)}</span>
    <span class="prix">${prix(it.prix)}</span>`);
  c.type = 'button'; c.onclick = () => ouvrirFiche(it);
  $('#plans').append(c);
});

// ───────── ma sélection ─────────
const CLE_SEL = 'kpn-selection';
let selection = stock.lire(CLE_SEL, {});
Object.keys(selection).forEach(id => { if (!PLATS.has(id)) delete selection[id]; });
const nbSel = () => Object.values(selection).reduce((a, b) => a + b, 0);
const totalSel = () => Object.entries(selection).reduce((s, [id, q]) => s + PLATS.get(id).prix * q, 0);
const tiroir = $('#selection');

function changer(id, delta) {
  const q = Math.max(0, (selection[id] || 0) + delta);
  if (q) selection[id] = q; else delete selection[id];
  stock.ecrire(CLE_SEL, selection);
  majSelection();
}
function texteSelection() {
  const lignes = Object.entries(selection).map(([id, q]) => `${q} × ${PLATS.get(id).nom} — ${prix(PLATS.get(id).prix * q)}`);
  return `Ma sélection — ${CONFIG.nom}\n${lignes.join('\n')}\nTotal : ${prix(totalSel())}`;
}
function majSelection() {
  const n = nbSel();
  $$('.compte').forEach(c => { c.textContent = n; c.hidden = !n; });
  $$('.plus').forEach(b => {
    const q = selection[b.dataset.id] || 0;
    b.classList.toggle('pris', q > 0); b.textContent = q || '+';
    b.setAttribute('aria-label', `Ajouter ${PLATS.get(b.dataset.id).nom} à ma sélection${q ? ` (${q} déjà)` : ''}`);
  });
  if (tiroir.open) dessinerTiroir();
}
function dessinerTiroir() {
  const lignes = Object.entries(selection);
  const tel = CONFIG.telephone.replace(/\s/g, '');
  tiroir.innerHTML = `
    <header><h3 id="selection-titre">Ma sélection</h3><button class="fermer" aria-label="Fermer">✕</button></header>
    ${lignes.length ? `
    <ul class="lignes">${lignes.map(([id, q]) => { const it = PLATS.get(id); return `
      <li>
        ${it.img ? `<img class="${detoure(it) ? 'detoure' : 'photo'}" src="${petite(it)}" alt="">` : '<span class="sans-img">✦</span>'}
        <span class="quoi"><b>${esc(it.nom)}</b><small>${prix(it.prix)}</small></span>
        <span class="qte"><button data-id="${id}" data-d="-1" aria-label="Un de moins">−</button><output>${q}</output><button data-id="${id}" data-d="1" aria-label="Un de plus">+</button></span>
      </li>`; }).join('')}</ul>
    <div class="total"><span>Total estimé</span><b>${prix(totalSel())}</b></div>
    <p class="mini">Ce n’est pas une commande : montrez cette liste au comptoir${tel ? ' ou appelez-nous' : ''}.</p>
    <div class="tiroir-actions">
      ${CONFIG.whatsapp ? `<a class="btn btn-or" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour, je souhaite commander :\n' + texteSelection())}">Envoyer sur WhatsApp</a>` : ''}
      ${tel ? `<a class="btn ${CONFIG.whatsapp ? 'btn-ligne' : 'btn-or'}" href="tel:${tel}">Appeler le restaurant</a>` : ''}
      <button class="btn ${CONFIG.whatsapp || tel ? 'btn-ligne' : 'btn-or'}" id="partager" type="button">Partager ma sélection</button>
      <button class="lien-discret" id="vider" type="button">Tout effacer</button>
    </div>` : `
    <div class="vide"><b>Votre sélection est vide</b>Touchez le + d’un plat pour l’ajouter et voir le total.</div>
    <div class="tiroir-actions"><a class="btn btn-or" href="#carte" id="vers-carte">Voir la carte</a></div>`}`;
  $('.fermer', tiroir).onclick = () => tiroir.close();
  $$('.qte button', tiroir).forEach(b => b.onclick = () => changer(b.dataset.id, +b.dataset.d));
  $('#vers-carte', tiroir)?.addEventListener('click', () => tiroir.close());
  $('#vider', tiroir)?.addEventListener('click', () => { selection = {}; stock.ecrire(CLE_SEL, selection); majSelection(); });
  $('#partager', tiroir)?.addEventListener('click', async () => {
    const text = texteSelection();
    try {
      if (navigator.share) await navigator.share({ title: 'Ma sélection — ' + CONFIG.nom, text });
      else { await navigator.clipboard.writeText(text); toast('Sélection copiée'); }
    } catch (e) { if (e.name !== 'AbortError') toast('Partage impossible sur cet appareil'); }
  });
}
$$('.ouvre-selection').forEach(b => b.onclick = () => { dessinerTiroir(); tiroir.showModal(); });

// ───────── fiche d'un plat ─────────
const fiche = $('#fiche');
function ouvrirFiche(it) {
  fiche.innerHTML = `
    <button class="fermer" aria-label="Fermer">✕</button>
    ${it.img ? `<div class="fiche-img ${detoure(it) ? 'detoure' : 'photo'}"><img src="${it.img}" alt=""></div>` : ''}
    <p class="sur">${esc(it.cat.titre)}</p>
    <h3>${esc(it.nom)}</h3>
    ${it.desc ? `<p class="desc">${esc(it.desc)}</p>` : ''}
    ${it.cat.note ? `<p class="desc">${esc(it.cat.note)}</p>` : ''}
    <p class="prix">${prix(it.prix)}</p>
    <button class="btn btn-or" id="fiche-ajout" type="button">Ajouter à ma sélection</button>`;
  $('.fermer', fiche).onclick = () => fiche.close();
  $('#fiche-ajout', fiche).onclick = () => { changer(it.id, 1); fiche.close(); toast(`${it.nom} ajouté`); };
  fiche.showModal();
}
$$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

// ───────── la carte ─────────
const onglets = $('#onglets'), categories = $('#categories');
const boutonPlus = it => `<button class="plus" type="button" data-id="${it.id}">+</button>`;

MENU.forEach(cat => {
  const lien = el('a', 'onglet', esc(cat.nom)); lien.href = '#c-' + cat.id; lien.dataset.id = cat.id;
  onglets.append(lien);

  const sec = el('section', 'categorie'); sec.id = 'c-' + cat.id; sec.dataset.id = cat.id;
  sec.append(el('header', 'cat-titre rv', `<h3>${esc(cat.titre)}</h3>${cat.note ? `<p>${esc(cat.note)}</p>` : ''}`));

  if (cat.liste) {
    const bloc = el('div', 'en-liste');
    const ul = el('ul', 'liste');
    cat.items.forEach(it => {
      const li = el('li', 'ligne', `<span class="n">${esc(it.nom)}${it.desc ? `<small>${esc(it.desc)}</small>` : ''}</span><span class="pts"></span><span class="p">${prix(it.prix)}</span>${boutonPlus(it)}`);
      li.dataset.q = sansAccent([it.nom, it.desc || '', cat.nom, traduire(it.nom), traduire(cat.nom)].join(' '));
      ul.append(li);
    });
    bloc.append(ul, el('div', 'liste-photo rv', `<img src="${cat.photo}" alt="${esc(cat.titre)}" loading="lazy">`));
    sec.append(bloc);
  } else {
    const grille = el('div', 'en-grille');
    cat.items.forEach(it => {
      const c = el('article', 'plat ' + (!it.img ? 'sans-photo' : detoure(it) ? 'detoure' : 'photo'), `
        <button class="ouvrir" type="button" aria-label="Voir ${esc(it.nom)}">
          <span class="visuel"><img src="${it.img ? petite(it) : 'assets/img/tour.svg'}" alt="" loading="lazy" decoding="async"></span>
          ${it.badge ? `<span class="badge">${esc(it.badge)}</span>` : ''}
          <span class="nom">${esc(it.nom)}</span>
          ${it.desc ? `<span class="desc">${esc(it.desc)}</span>` : ''}
        </button>
        <div class="bas"><span class="prix">${prix(it.prix)}</span>${boutonPlus(it)}</div>`);
      c.dataset.q = sansAccent([it.nom, it.desc || '', cat.nom, traduire(it.nom), traduire(cat.nom)].join(' '));
      $('.ouvrir', c).onclick = () => ouvrirFiche(it);
      grille.append(c);
    });
    sec.append(grille);
  }
  categories.append(sec);
});

categories.addEventListener('click', e => {
  const b = e.target.closest('.plus'); if (!b) return;
  changer(b.dataset.id, 1);
  b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
});

// l'onglet actif suit le défilement
let centrage;
const activer = id => $$('.onglet', onglets).forEach(o => {
  const on = o.dataset.id === id; o.classList.toggle('actif', on);
  if (!on) { o.removeAttribute('aria-current'); return; }
  o.setAttribute('aria-current', 'true');
  // La barre ne se recentre qu'une fois le défilement posé.
  clearTimeout(centrage);
  centrage = setTimeout(() => onglets.scrollTo({ left: o.offsetLeft - (onglets.clientWidth - o.offsetWidth) / 2, behavior: calme ? 'auto' : 'smooth' }), 160);
});
const espion = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activer(e.target.dataset.id); }), { rootMargin: '-35% 0px -60% 0px' });
$$('.categorie').forEach(s => espion.observe(s));
activer(MENU[0].id);

// recherche
$('#recherche').addEventListener('input', e => {
  const mots = sansAccent(e.target.value).split(/\s+/).filter(Boolean);
  let total = 0;
  $$('.categorie').forEach(sec => {
    let n = 0;
    $$('[data-q]', sec).forEach(p => { const ok = mots.every(m => p.dataset.q.includes(m)); p.hidden = !ok; if (ok) { n++; p.classList.add('vu'); } });
    sec.hidden = !n; total += n;
    const photo = $('.liste-photo', sec); if (photo) photo.hidden = mots.length > 0;
  });
  $('#aucun').hidden = total > 0;
});

// ───────── avis ─────────
// Avec Supabase configuré, les avis sont enregistrés en ligne et visibles par tous.
// Sinon ils restent dans le navigateur du visiteur.
const CLE_AVIS = 'kpn-avis';
const enLigne = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseCle);
const api = (chemin, options = {}) => fetch(CONFIG.supabaseUrl.replace(/\/$/, '') + '/rest/v1/' + chemin, {
  ...options,
  headers: { apikey: CONFIG.supabaseCle, Authorization: 'Bearer ' + CONFIG.supabaseCle, 'Content-Type': 'application/json', ...options.headers },
}).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
const depot = {
  lire: () => enLigne
    ? api('avis?select=nom,note,texte,date:created_at&visible=is.true&order=created_at.desc&limit=200').then(r => r.json())
    : Promise.resolve(stock.lire(CLE_AVIS, [])),
  ajouter: avis => enLigne
    ? api('avis', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(avis) })
    : Promise.resolve(stock.ecrire(CLE_AVIS, [{ ...avis, date: new Date().toISOString() }, ...stock.lire(CLE_AVIS, [])])),
};

const etoiles = n => `<span class="stars" role="img" aria-label="${n} / 5">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
const liste = $('#avis-liste'), formAvis = $('#avis-form'), retour = $('#avis-retour'), lienGoogle = $('#avis-google');
$('#avis-note').hidden = enLigne;
if (CONFIG.googleAvis) { lienGoogle.href = CONFIG.googleAvis; lienGoogle.hidden = false; }

async function afficherAvis() {
  let avis;
  try { avis = await depot.lire(); }
  catch (e) { console.error(e); liste.innerHTML = '<div class="vide"><b>Avis indisponibles</b>Impossible de charger les avis pour le moment. Réessayez plus tard.</div>'; return; }
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
        <span class="qui"><b>${esc(a.nom)}</b><time datetime="${esc(a.date)}">${new Date(a.date).toLocaleDateString(LANGUE === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</time></span>
        ${etoiles(Math.min(5, Math.max(1, Math.round(a.note))))}
      </header>
      <p>${esc(a.texte)}</p>
    </article>`).join('');
}
formAvis.addEventListener('submit', async e => {
  e.preventDefault();
  const nom = $('#avis-nom').value.trim(), texte = $('#avis-texte').value.trim();
  const note = Number(new FormData(formAvis).get('note'));
  retour.className = 'erreur';
  if (!note) { retour.textContent = 'Choisissez une note en touchant les étoiles.'; return; }
  if (!nom || !texte) { retour.textContent = 'Indiquez votre nom et votre commentaire.'; return; }
  // Google n'accepte que les avis écrits sur Google : on copie le texte pour qu'il n'y ait plus qu'à le coller.
  let copie = false;
  if (CONFIG.googleAvis) { try { await navigator.clipboard.writeText(texte); copie = true; } catch (err) {} }
  const bouton = $('button[type=submit]', formAvis); bouton.disabled = true;
  try { await depot.ajouter({ nom, note, texte }); }
  catch (err) { console.error(err); retour.textContent = 'Votre avis n’a pas pu être enregistré. Vérifiez votre connexion et réessayez.'; return; }
  finally { bouton.disabled = false; }
  formAvis.reset();
  retour.className = 'merci';
  retour.textContent = !CONFIG.googleAvis ? 'Merci pour votre avis !'
    : copie ? 'Merci ! Votre commentaire est copié : il ne reste qu’à le coller sur Google.'
    : 'Merci ! Vous pouvez aussi le publier sur Google.';
  if (CONFIG.googleAvis) { lienGoogle.textContent = 'Publier aussi sur Google'; lienGoogle.className = 'btn btn-or'; }
  afficherAvis();
});
afficherAvis();

// ───────── infos pratiques ─────────
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const plages = txt => (txt.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/g) || []).map(p => p.split('-').map(h => { const [a, b] = h.trim().split(':').map(Number); return a * 60 + b; }));
const joli = txt => plages(txt).length ? txt.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => `${+h} h${m === '00' ? '' : ' ' + m}`).replace(/\s*-\s*/g, ' – ').replace(/,\s*/g, ' · ') : 'Fermé';

// L'heure du restaurant (Paris), quel que soit le fuseau du visiteur.
const maintenantParis = () => { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' })); } catch (e) { return new Date(); } };

function etatOuverture() {
  if (CONFIG.horaires.length !== 7) return null;
  const d = maintenantParis(), j = (d.getDay() + 6) % 7, min = d.getHours() * 60 + d.getMinutes();
  const auj = plages(CONFIG.horaires[j]), hier = plages(CONFIG.horaires[(j + 6) % 7]);
  const fin = t => `${Math.floor(t / 60)} h${t % 60 ? ' ' + String(t % 60).padStart(2, '0') : ''}`;
  for (const [a, b] of hier) if (b <= a && min < b) return { ouvert: true, texte: `Ouvert · jusqu’à ${fin(b)}` };
  for (const [a, b] of auj) if (min >= a && (min < b || b <= a)) return { ouvert: true, texte: `Ouvert · jusqu’à ${fin(b)}` };
  const suite = auj.find(([a]) => a > min);
  return { ouvert: false, texte: suite ? `Fermé · ouvre à ${fin(suite[0])}` : 'Fermé actuellement' };
}

{
  const tel = CONFIG.telephone.replace(/\s/g, '');
  const carteMaps = CONFIG.adresse && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.nom + ' ' + CONFIG.adresse)}`;
  const etat = etatOuverture();
  const aVenir = '<span class="avenir">Bientôt en ligne</span>';
  const grilleHoraires = CONFIG.horaires.length === 7 && new Set(CONFIG.horaires).size === 1
    ? `<p class="tous">Tous les jours<b>${esc(joli(CONFIG.horaires[0]))}</b></p>`
    : CONFIG.horaires.length === 7
    ? `<table class="horaires">${JOURS.map((jr, k) => `<tr class="${k === (maintenantParis().getDay() + 6) % 7 ? 'auj' : ''}"><th scope="row">${jr}</th><td>${esc(joli(CONFIG.horaires[k]))}</td></tr>`).join('')}</table>`
    : aVenir;
  const ICONES = {
    lieu: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    heure: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3.5 2',
    sac: 'M6 8h12l-1 12H7L6 8Zm3 0V7a3 3 0 0 1 6 0v1',
    tel: 'M6 3h4l1.5 5L9 9.5a12 12 0 0 0 5.5 5.5l1.500-2.500 5 1.500v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z',
  };
  const cartes = [
    [ICONES.lieu, 'Adresse', CONFIG.adresse ? esc(CONFIG.adresse).replace(/,\s*/, '<br>') : aVenir, carteMaps && `<a class="btn btn-ligne petit" target="_blank" rel="noopener" href="${carteMaps}">Itinéraire</a>`],
    [ICONES.heure, 'Horaires', (etat ? `<span class="etat ${etat.ouvert ? 'oui' : 'non'}">${esc(etat.texte)}</span>` : '') + grilleHoraires],
    [ICONES.sac, 'Sur place ou à emporter', `Mangez sur place ou emportez votre commande.${CONFIG.livraison ? '' : '<br><span class="avenir">Pas de livraison pour le moment.</span>'}`],
    [ICONES.tel, 'Téléphone', CONFIG.telephone ? esc(CONFIG.telephone) : aVenir, tel && `<a class="btn btn-or petit" href="tel:${tel}">Appeler</a>`],
  ];
  cartes.forEach(([icone, titre, corps, action]) => $('#cartes-infos').append(el('div', 'info rv', `<svg class="ic grand" viewBox="0 0 24 24" aria-hidden="true"><path d="${icone}"/></svg><h3>${titre}</h3><div class="corps">${corps}</div>${action || ''}`)));

  if (CONFIG.adresse) {
    const plan = $('#plan'); plan.hidden = false;
    plan.innerHTML = `<iframe title="Plan d’accès" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(CONFIG.nom + ' ' + CONFIG.adresse)}&output=embed"></iframe>`;
  }
  if (etat) { const b = $('#ouvert-barre'); b.hidden = false; b.textContent = etat.ouvert ? 'Ouvert' : 'Fermé'; b.classList.add(etat.ouvert ? 'oui' : 'non'); }
  if (tel) { const d = $('#dock-infos'); d.href = 'tel:' + tel; d.innerHTML = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONES.tel}"/></svg>Appeler`; }

  const reseaux = [['Instagram', CONFIG.instagram], ['TikTok', CONFIG.tiktok], ['Uber Eats', CONFIG.uberEats], ['Deliveroo', CONFIG.deliveroo]].filter(r => r[1]);
  $('#reseaux').innerHTML = reseaux.map(([n, u]) => `<a target="_blank" rel="noopener" href="${esc(u)}">${n}</a>`).join('');

  // Données structurées pour Google (fiche restaurant + carte).
  const ld = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: CONFIG.nom, servesCuisine: ['Afghane', 'Halal'],
    priceRange: '€', image: new URL('assets/img/partage.jpg', location.href).href, url: location.origin + location.pathname,
    ...(CONFIG.adresse && { address: CONFIG.adresse }), ...(CONFIG.telephone && { telephone: CONFIG.telephone }),
    hasMenu: { '@type': 'Menu', hasMenuSection: MENU.map(c => ({ '@type': 'MenuSection', name: c.titre, hasMenuItem: c.items.map(it => ({ '@type': 'MenuItem', name: it.nom, ...(it.desc && { description: it.desc }), offers: { '@type': 'Offer', price: it.prix.toFixed(2), priceCurrency: 'EUR' } })) })) },
  };
  const s = el('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.append(s);
}

// ───────── mentions légales ─────────
{
  const s = CONFIG.societe, m = $('#mentions');
  $('#droits').textContent = `© ${new Date().getFullYear()} ${CONFIG.nom} — ${s.nom} · Tous droits réservés`;
  m.innerHTML = `
    <button class="fermer" aria-label="Fermer">✕</button>
    <h3>Mentions légales</h3>
    <h4>Éditeur du site</h4>
    <p>${esc(s.nom)}<br>${esc(s.forme)}<br>${esc(CONFIG.adresse)}<br>
      SIRET : ${esc(s.siret)}<br>${esc(s.registre)}<br>
      N° de TVA intracommunautaire : ${esc(s.tva)}
      ${s.responsable ? `<br>Responsable de la publication : ${esc(s.responsable)}` : ''}
      ${CONFIG.telephone ? `<br>Téléphone : ${esc(CONFIG.telephone)}` : ''}</p>
    <h4>Hébergement</h4>
    <p>${esc(s.hebergeur)}</p>
    <h4>Propriété intellectuelle</h4>
    <p>Le logo, les textes, les photos et l’ensemble du contenu de ce site appartiennent à ${esc(s.nom)}. Toute copie ou réutilisation sans autorisation écrite est interdite.</p>
    <h4>Données personnelles</h4>
    <p>Quand vous publiez un avis, votre nom, votre note et votre commentaire sont enregistrés et affichés publiquement sur ce site. Votre sélection de plats reste uniquement sur votre appareil. Le site n’utilise aucun cookie publicitaire ni outil de suivi. Pour faire retirer un avis, adressez-vous au restaurant.</p>
    <h4>Prix</h4>
    <p>Prix TTC. Photos non contractuelles.</p>`;
  $('.fermer', m).onclick = () => m.close();
  $('#ouvre-mentions').onclick = () => m.showModal();
}

// ───────── langue ─────────
{
  const autre = LANGUE === 'en' ? 'fr' : 'en';
  $$('.change-langue').forEach(b => { b.textContent = autre.toUpperCase(); b.setAttribute('aria-label', autre === 'en' ? 'English version' : 'Version française'); b.onclick = () => choisirLangue(autre); });
  // Bulle d'accueil : la dernière info du restaurant et, à la première visite, le choix de la langue.
  // Elle s'affiche à la première visite, puis de nouveau une fois à chaque nouvelle info.
  const bulle = $('#bienvenue'), info = CONFIG.actualite, CLE_INFO = 'kpn-info';
  const lu = cle => { try { return localStorage.getItem(cle); } catch (e) { return null; } };
  const premiere = !CHOISIE, nouvelle = Boolean(info) && lu(CLE_INFO) !== info.id;
  if (premiere || nouvelle) {
    const titre = info ? info.titre : 'Bienvenue !', texte = info ? info.texte : '';
    bulle.innerHTML = premiere ? `
      <img src="assets/img/tour.svg" alt="" width="54" height="84">
      <div data-fixe>
        ${info ? '<p class="sur">Dernières infos · Latest news</p>' : ''}
        <h3 id="bienvenue-titre">${esc(titre)}</h3>
        ${texte ? `<p class="desc">${esc(texte)}</p>` : ''}
        <h3 class="en" lang="en">${esc(enAnglais(titre))}</h3>
        ${texte ? `<p class="desc" lang="en">${esc(enAnglais(texte))}</p>` : ''}
        <p class="choix">Choisissez votre langue · Choose your language</p>
      </div>
      <div class="langues">
        <button class="btn btn-or" type="button" data-langue="fr">Français</button>
        <button class="btn btn-or" type="button" data-langue="en">English</button>
      </div>` : `
      <button class="fermer" aria-label="Fermer">✕</button>
      <img src="assets/img/tour.svg" alt="" width="54" height="84">
      <p class="sur">Dernières infos</p>
      <h3 id="bienvenue-titre">${esc(titre)}</h3>
      <p class="desc">${esc(texte)}</p>
      <a class="btn btn-or" href="#carte" id="bulle-carte">Voir la carte</a>`;
    $$('button[data-langue]', bulle).forEach(b => b.onclick = () => { noter(); if (!choisirLangue(b.dataset.langue)) bulle.close(); });
    $('.fermer', bulle)?.addEventListener('click', () => bulle.close());
    $('#bulle-carte', bulle)?.addEventListener('click', () => bulle.close());
    const noter = () => { try { if (info) localStorage.setItem(CLE_INFO, info.id); localStorage.getItem('kpn-langue') || localStorage.setItem('kpn-langue', LANGUE); } catch (e) {} };
    bulle.addEventListener('close', noter);
    bulle.showModal();
  }
}

// ───────── apparition au défilement ─────────
if (calme || !('IntersectionObserver' in window)) $$('.rv').forEach(e => e.classList.add('vu'));
else {
  const vue = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vu'); vue.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(e => vue.observe(e));
}

majSelection();
pret();

// Mise en cache des photos et des polices (voir sw.js).
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
