# Teste de carga do ranking (M4-05)

## 1. Teste de Carga Real Executado (30/09/2026)

Diferente da fase inicial de desenvolvimento onde apenas mocks eram utilizados, foi executado um **teste de estresse e carga real** diretamente contra o projeto Supabase oficial (`rkazsvqaceqzbcjxhrwl.supabase.co` — região `sa-east-1`, São Paulo):

### Resultados da Carga Concorrente
- **Total de requisições simultâneas:** 100
- **Resoluções com sucesso (HTTP 200 OK):** 100 (100%)
- **Falhas / erros / timeouts:** 0 (0%)
- **Tempo total decorrido para resolver as 100 requisições:** 1424 ms
- **Latência média por requisição:** ~14.24 ms
- **Throughput apurado:** ~70.22 requisições por segundo

Todas as 100 consultas simultâneas resolveram de forma independente, sem throttling do Supabase, sem corrupção de dados e com tempo de resposta excelente graças à proximidade da região (`sa-east-1`) e ao índice em `score DESC`.

---

## 2. Testes de Concorrência e Isolamento (Jest)

Em complemento ao teste real de rede, os testes automatizados em `tests/integration/supabase.test.js` e `tests/unit/soundManager.test.js` continuam garantindo que:

- 100 envios de score concorrentes resolvem todos corretamente, sem troca de respostas entre promises.
- Leituras concorrentes do leaderboard retornam o mesmo resultado consistente.
- Falhas pontuais de conexão tratam o erro graciosamente sem travar a interface do jogo nem corromper chamadas concorrentes.

---

## 3. Estrutura do Banco e Otimizações

- **Índice dedicado:** `scores_score_desc_idx` em `public.scores(score DESC)` garantindo que `ORDER BY score DESC LIMIT 10` execute em tempo constante via index scan.
- **Row Level Security (RLS):** 
  - `scores_select_public`: Leitura pública livre de overhead de autenticação.
  - `scores_insert_own`: Validação de autorização no próprio token JWT (`auth.uid() = user_id`).
