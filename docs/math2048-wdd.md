# Math2048 — World Design Document (WDD)

**Projeto:** Jogo matemático
**Disciplina:** Projeto de Aprendizagem Colaborativa Extensionista III
**Acadêmicos:** Felipe Vieira, Júlia Paz e Silva, Klaus Christoph Emmerich Jourdain, Lucas Montimór Soares Barra, Pedro Martins do Nascimento
**Professor:** Andrei Carniel
**Data:** 18/05/2026

---

## 1. Introdução

- **Nome do Projeto:** Math2048
- **Objetivo do Documento:** Descrever a ambientação visual, a atmosfera cognitiva, a metáfora de "mundo" (o tabuleiro e a barreira matemática) e as mecânicas de imersão que guiam a experiência do utilizador.
- **Público-Alvo:** Equipe de design, desenvolvedores front-end e stakeholders. Como usuários finais, estudantes do ensino básico e médio que buscam desenvolver habilidades de raciocínio lógico-matemático de forma lúdica e engajante.

## 2. Visão Geral do Mundo

- **Ambientação:** Um ambiente digital minimalista, focado na abstração matemática e lógica, onde o "espaço físico" é delimitado por uma matriz geométrica de 4x4.
- **Tema Principal:** Superação de desafios através do raciocínio lógico-matemático (fusão de blocos e resolução de equações de 1º grau).
- **Tonalidade:** Focada, limpa, acadêmica e estimulante, foco no "flow" do jogador, sem distrações visuais desnecessárias.
- **Lore Básica:** O jogador é um estudante/desafiante inserido em um universo numérico abstrato. Para alcançar a glória matemática (o bloco 2048), ele precisa não apenas dominar a lógica geométrica do movimento, mas também decifrar os "Portais de Gatekeeping" (as equações de 1º grau) que bloqueiam o progresso do tabuleiro em momentos críticos (blocos 16, 64, 256 e 1024).

## 3. Geografia e Ambientes

- **Mapa do Mundo:** O "mundo" é o tabuleiro centralizado de 16 blocos (matriz 4x4) envolto por uma interface de usuário (HUD) responsiva que exibe o placar atual, o recorde pessoal (High Score) e o nome do usuário.
- **Biomas:**
  - **Estado Fluido (Livre):** Tabuleiro em movimento livre onde blocos se fundem.
  - **Estado Bloqueado (Desafio):** O tabuleiro congela e um modal de equação matemática (o "Portal") sobrepõe o mapa, exigindo resolução imediata.
- **Pontos de Interesse:** Os blocos de gatilho cognitivo: 16, 64, 256 e 1024, que transicionam o jogador de bioma. A "Leaderboard Global" (Mural dos Campeões): onde as lendas que conquistaram o topo do mundo têm seus nomes expostos.
- **Clima e Ecologia:** O "clima" é ditado pela densidade do tabuleiro. À medida que o tabuleiro se enche de blocos sem movimentos possíveis, a atmosfera torna-se tensa (aproximação do Game Over).

## 4. Cultura e Sociedade

- **Raças e Facções:**
  - **Os Aprendizes:** Jogadores casuais/estudantes que buscam melhorar suas habilidades matemáticas básicas.
  - **Os Mestres do Grid:** Competidores focados no topo da tabela de classificação (Top 10).
- **Política e Economia:** Sistema meritocrático baseado em pontos de score e resolução correta de equações. Não há microtransações; o conhecimento e a agilidade mental são as únicas moedas válidas.
- **Religião e Crenças:** A crença na harmonia matemática e no algoritmo perfeito de fusão de potências de 2.
- **Costumes e Tradições:** O hábito diário de desafiar a pontuação máxima local/global e o ritual de "Logout/Login" para registrar o progresso na nuvem via Supabase.

## 5. Personagens e NPCs

- **Personagens Principais:** O próprio jogador (autenticado e identificado no HUD pelo seu nome de utilizador).
- **NPCs Importantes:** O **Gatekeeper** — entidade abstrata que se manifesta nos momentos críticos do tabuleiro (blocos 16, 64, 256 e 1024), impondo desafios de equações de 1º grau como condição obrigatória para o desbloqueio do mundo. Representa a barreira entre o conhecimento superficial e a maestria matemática.
- **População Geral:** Os blocos numéricos (2, 4, 8... 2048) que se movem, colidem e se fundem conforme os comandos do jogador.

## 6. História e Narrativa

- **Linha do Tempo:**
  - **Era da Gênese:** Inicialização do tabuleiro com dois valores aleatórios (2 ou 4).
  - **Eras de Barreira:** Momentos de provação ao atingir os blocos 16, 64, 256 e 1024.
  - **O Apocalipse (Game Over):** Fim dos tempos por falta de movimentos possíveis.
  - **A Ascensão (You Win):** Conquista do bloco 2048 e entrada no Modo Infinito.
- **Arcos Narrativos:** A jornada de superação do estudante, saindo de contas simples até conseguir equilibrar a estratégia espacial do tabuleiro com a resolução de equações sob pressão.
- **Missões e Side Quests:** A missão principal é atingir o bloco 2048. As "side quests" consistem em bater recordes pessoais e subir de posição no ranking global.

## 7. Mecânicas Relacionadas ao Mundo

- **Exploração:** Deslocamento geométrico dos blocos através de gestos de swipe em dispositivos móveis ou teclas direcionais no desktop nas quatro direções cardeais (N, S, L, O).
- **Sistema de Descoberta:** Desbloqueio visual de novos números de blocos (ex: descobrir a cor/estilo do bloco 512, 1024, etc.).
- **Impacto do Jogador:** Cada movimento reconstrói o tabuleiro (gerando um novo bloco aleatório). Responder incorretamente à equação impede o prosseguimento do jogo, travando o "mundo" até que a resposta certa seja fornecida.
- **Eventos Dinâmicos:** A ativação do modal de desafio (Gatekeeper) toda vez que um dos blocos marco (16, 64, 256, 1024) é gerado pela primeira vez na rodada.

## 8. Arte e Estilo Visual

- **Direção de Arte:** Estilo minimalista, limpo e "Flat Design", garantindo leveza técnica para dispositivos móveis antigos através de renderização CSS pura.
- **Referências Visuais:** O jogo clássico "2048" de Gabriele Cirulli e interfaces modernas de aplicações de e-learning (como Duolingo/Kahoot).
- **Paleta de Cores:** Cores contrastantes e progressivas. Tons pastel suaves para blocos baixos (2, 4, 8), cores quentes e vibrantes para blocos médios (16, 64, 128) e tons dourados/brilhantes para os blocos de alta pontuação (1024, 2048) para facilitar a acessibilidade e contraste.

## 9. Som e Atmosfera

- **Trilha Sonora:** Estilo focado em "Lo-Fi" ou música ambiente minimalista, que estimula a concentração e reduz a ansiedade durante os desafios matemáticos (integrada de forma leve para não exceder limites de pacotes).
- **Efeitos Sonoros:** Sons curtos em formato WAV:
  - Som suave de "clique/deslize" ao mover blocos.
  - Som de "fusão" harmônico ao juntar blocos de mesmo valor.
  - Alerta sonoro de "desafio" ao abrir o modal de equação.
  - Fanfarra curta de vitória (You Win) e som grave de derrota (Game Over).
- **Narração:** Sem dublagem ou narração por voz para garantir que o pacote de ativos se mantenha abaixo dos 5MB exigidos.

## 10. Integração com o Gameplay

- **Como o Mundo Afeta o Jogador:** A falta de espaço físico na matriz 4x4 limita as decisões táticas do jogador. A necessidade de conexão à internet para enviar pontos à leaderboard afeta a experiência de jogo.
- **Recursos do Mundo:** Dados locais em arquivos JSON contendo o banco de equações matemáticas que alimentam os desafios.
- **Interatividade:** O jogador pode destruir blocos através da fusão e resetar o mundo a qualquer momento através do botão "New Game" ou fazer "Logout" para trocar de conta.

## 11. Cronograma de Desenvolvimento do Mundo

- **Fase 1 (Design Visual) — Semana 1 e 2:** Criação dos protótipos de tela no Figma, incluindo UI do Tabuleiro, Modais de Desafio (Gatekeeper) e HUD com placar, recorde pessoal e nome do utilizador.
- **Fase 2 (Estruturação do Banco) — Semana 3 e 4:** Definição e preenchimento do JSON estático com o banco de equações de 1º grau, categorizadas por nível de dificuldade para cada bloco gatilho (16, 64, 256 e 1024).
- **Fase 3 (Implementação Visual) — Semana 5 e 6:** Programação do CSS Responsivo, transições e efeitos visuais dos blocos no DOM, incluindo a paleta de cores progressiva e animações de fusão.
- **Fase 4 (Integração Supabase) — Semana 7 e 8:** Configuração do módulo de autenticação (Supabase Auth) para registro e login de utilizadores, e integração com o banco de dados PostgreSQL para gravação e consulta do ranking Top 10 global em tempo real.
- **Fase 5 (Build Mobile e Testes) — Semana 9 e 10:** Configuração do ambiente Apache Cordova para empacotamento do código web em APK Android, realização de testes de desempenho em dispositivos de baixo custo e validação dos requisitos não funcionais de performance (60 FPS, resposta abaixo de 100ms).

**Tarefas Específicas:**
- Criação de ícones vetoriais em SVG
- Configuração de fontes acessíveis
- Estruturação de contraste para conformidade com requisitos de acessibilidade
- Validação do código via ESLint
- Documentação das funções principais no padrão JSDoc

## 12. Referências

**Inspirações:**
- CIRULLI, Gabriele. *2048: The source code for 2048*. GitHub, 2014. Disponível em: https://github.com/gabrielecirulli/2048. Acesso em: 16 mai. 2026.
- PRENSKY, Marc. *Digital Game-Based Learning*. McGraw-Hill, 2001.
- GEE, James Paul. *What Video Games Have to Teach Us About Learning and Literacy*. Palgrave Macmillan, 2003.

**Documentação Técnica:**
- MDN WEB DOCS. *JavaScript Reference*. Mozilla, 2024. Disponível em: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference. Acesso em: 10 mai. 2026.
- SUPABASE. *Supabase Documentation*. Disponível em: https://supabase.com/docs. Acesso em: 16 mai. 2026.
- APACHE CORDOVA. *Cordova Documentation*. Disponível em: https://cordova.apache.org/docs/en/latest/. Acesso em: 16 mai. 2026.
- FIGMA. *Figma Help Center*. Disponível em: https://help.figma.com. Acesso em: 16 mai. 2026.
- W3C. *Web Content Accessibility Guidelines (WCAG) 2.1*. Disponível em: https://www.w3.org/TR/WCAG21/. Acesso em: 16 mai. 2026.

**Documentos Relacionados:**
- Documento de Design de Teste do Math2048 (TDD - Math2048).
