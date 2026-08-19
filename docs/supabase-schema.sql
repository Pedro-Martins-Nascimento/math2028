-- Math2048 — schema do Supabase
-- Rode este script no SQL Editor do projeto Supabase antes de testar M3.
--
-- Segurança / anti-adulteração (M3-05):
--   - RLS habilitado: cada usuário só pode inserir uma linha com o próprio
--     user_id (auth.uid()), então o score não pode ser inserido em nome
--     de outro usuário só trocando o payload no client.
--   - Leitura (SELECT) é pública, pois o ranking é global e não exige
--     autenticação para ser consultado.
--   - Nenhuma coluna de PII além do e-mail é armazenada (LGPD: minimização
--     de dados — não coletamos nome completo, telefone, documento etc.).

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  username text not null,
  score integer not null check (score >= 0),
  created_at timestamptz not null default now()
);

create index if not exists scores_score_desc_idx on public.scores (score desc);

alter table public.scores enable row level security;

-- Qualquer pessoa pode ler o ranking (necessário para o leaderboard público).
create policy "scores_select_public"
  on public.scores for select
  using (true);

-- Um usuário só pode inserir pontuação em seu próprio nome.
create policy "scores_insert_own"
  on public.scores for insert
  with check (auth.uid() = user_id);

-- Ninguém pode alterar ou apagar pontuações já enviadas (evita adulteração
-- posterior de um score já registrado).
-- (Nenhuma policy de UPDATE/DELETE é criada — por padrão, RLS bloqueia tudo
-- que não tem policy explícita.)
