-- Table des avis du site Kaboul Paris Nord.
-- Déjà appliqué au projet « kaboul-paris-nord ». Gardé ici pour référence.

create table public.avis (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nom        text not null check (char_length(nom)   between 1 and 40),
  note       int  not null check (note between 1 and 5),
  texte      text not null check (char_length(texte) between 1 and 600),
  visible    boolean not null default true   -- décocher pour masquer un avis sans le supprimer
);

alter table public.avis enable row level security;
revoke all on public.avis from anon, authenticated;
grant select, insert on public.avis to anon;

-- Les visiteurs peuvent lire les avis visibles et en ajouter. Ils ne peuvent ni modifier ni supprimer.
create policy "lire les avis visibles" on public.avis for select to anon using (visible);
create policy "ajouter un avis"        on public.avis for insert to anon with check (visible);
