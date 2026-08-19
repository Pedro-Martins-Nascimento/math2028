# Teste de carga do ranking (M4-05)

## O que foi testado

Este ambiente de desenvolvimento não tem acesso de rede ao domínio
`supabase.co` (sandbox restrito a domínios de pacotes/CI), então não foi
possível gerar carga real contra o projeto Supabase (`vtmnczqnrwbqxysddfdz`).

Em vez disso, `tests/integration/supabase.test.js` simula concorrência na
camada de serviço (`scoreService.submitScore`, `leaderboardQuery.getTopScores`)
usando um cliente Supabase mockado, para validar que:

- 100 envios de score concorrentes resolvem todos corretamente, sem
  respostas trocadas entre chamadas (sem "cross-talk" de promises).
- 50 leituras concorrentes do leaderboard retornam o mesmo resultado
  correto para todas as chamadas.
- Uma falha pontual em uma submissão (ex.: timeout) não derruba nem
  corrompe as demais chamadas concorrentes — cada uma resolve
  independentemente com seu próprio `{ error }`.

Esses testes garantem que o **código da aplicação** é seguro sob
concorrência. Eles não medem a latência real do Postgres/Supabase.

## Preparo já feito no banco real para suportar carga

- Índice `scores_score_desc_idx` em `scores(score DESC)` — ver
  `docs/supabase-schema.sql` — para que `ORDER BY score DESC LIMIT 10`
  continue rápido conforme a tabela cresce, em vez de fazer um full scan.
- RLS com policy de INSERT simples (`auth.uid() = user_id`), sem lógica
  cara (subqueries, joins) que pese sob volume.

## Gargalos conhecidos (não testáveis neste ambiente)

| Risco | Mitigação recomendada |
|---|---|
| Rate limiting do Supabase no plano gratuito sob muitos usuários simultâneos | Acompanhar o painel do projeto; considerar upgrade de plano antes do lançamento público |
| Connection pool do Postgres esgotada sob muitos INSERTs simultâneos | Supabase usa PgBouncer por padrão (pooling); revisar `pool_mode` se o volume crescer muito |
| Leaderboard lido a cada abertura de tela, sem cache | Se o app tiver muitos usuários simultâneos, considerar cache client-side de alguns segundos para `getTopScores` |

## Como gerar carga real (quando houver acesso de rede)

```bash
# Exemplo simples com autocannon contra um endpoint REST do Supabase
npx autocannon -m POST \
  -H "apikey: <anon-key>" -H "Content-Type: application/json" \
  -b '{"user_id":"...","username":"teste","score":100}' \
  -c 50 -d 10 \
  https://vtmnczqnrwbqxysddfdz.supabase.co/rest/v1/scores
```

Registrar aqui os resultados (latência p50/p95, taxa de erro) assim que
isso for executado contra o projeto real.
