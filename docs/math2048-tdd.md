# Math2048 — Documento de Teste (TDD - Test Design Document)

**Projeto:** Jogo matemático
**Disciplina:** Projeto de Aprendizagem Colaborativa Extensionista III
**Alunos:** Felipe Vieira, Júlia Paz e Silva, Klaus Jourdain, Lucas Montimór Soares Barra, Pedro Martins do Nascimento
**Professor:** Andrei Carniel
**Data:** 31/03/2026

---

## 1. Introdução

- **Nome do Projeto:** Math2048
- **Objetivo do Documento:** Especificar rigorosamente a arquitetura de software, a stack tecnológica, os requisitos funcionais e não funcionais, e o fluxo de dados para o desenvolvimento de um jogo sério matemático.
- **Público-Alvo:** Equipe de desenvolvimento, gerentes de projeto, stakeholders.

## 2. Escopo

### O que está incluído:
- **Motor de Jogo Core (2048):** Implementação de uma matriz 2D (4x4) em JavaScript puro. Inclui algoritmos de deslocamento de blocos, deteção de colisões e lógica de fusão de potências de 2 (2, 4, 8, 16... 2048).
- **Sistema de Gatekeeping Matemático:** Interrupção obrigatória do fluxo de jogo baseada em gatilhos de pontuação ou valor de bloco. O sistema apresenta equações de 1º grau retiradas de um banco de dados estático (JSON local) que devem ser resolvidas para desbloquear o tabuleiro.
- **Módulo de Autenticação (Supabase Auth):** Sistema de registo e login de utilizadores para personalização da experiência e proteção de dados de progresso.
- **Sistema de Ranking e Persistência (Supabase DB):** Gravação de pontuações máximas (High Scores) numa base de dados PostgreSQL remota. Inclui uma lógica de consulta para exibir um "Top 10" global em tempo real.
- **Interface de Utilizador (UI) Responsiva:** Layout desenvolvido com HTML5 e CSS3 (Flexbox/Grid), garantindo que o jogo seja jogável tanto em browsers de desktop quanto em dispositivos móveis.
- **Encapsulamento Mobile (Apache Cordova):** Configuração de ambiente para que o código Web seja executado dentro de uma WebView nativa Android, permitindo a distribuição como aplicação (.apk).
- **Gestão de Sessão Local:** Uso de localStorage para manter o estado da partida atual (posições da matriz e score) caso a aplicação seja reiniciada inesperadamente.

### O que não está incluído:
- **Funcionamento Offline Total:** Devido à exigência de autenticação e submissão de ranking via Supabase, o jogo não funcionará sem uma ligação ativa à Internet.
- **Geração Dinâmica de Equações por IA:** As questões são fixas e pré-definidas no código (banco de dados estático), não havendo geração procedural de novos problemas em tempo real.
- **Modo Multiplayer em Tempo Real:** Não existe interação direta (PvP) entre jogadores na mesma partida; a competição limita-se ao ranking assíncrono.
- **Gráficos 3D ou Motores Pesados:** O projeto evita o uso de Unity ou Three.js para garantir leveza e compatibilidade total com WebViews limitadas de telemóveis antigos.
- **Sistemas de Microtransações ou Compras In-App:** O projeto tem fins puramente educativos e académicos, sem qualquer integração de pagamentos.
- **Suporte:** O foco exclusivo é Web (Browser) e Mobile (Android via Cordova).

## 3. Requisitos Funcionais

| ID | Descrição |
|---|---|
| RF-01 | O sistema deve inicializar uma matriz 4x4 com dois valores aleatórios (2 ou 4). |
| RF-02 | O utilizador deve poder deslizar os blocos em quatro direções (N, S, L, O). |
| RF-03 | Blocos com o mesmo valor devem fundir-se ao colidir. |
| RF-04 | O sistema deve gerar um novo bloco após cada movimento que resulte em deslocamento. |
| RF-05 | O jogo deve travar e exibir um modal de equação ao atingir o bloco 16. |
| RF-06 | O jogo deve travar e exibir um modal de equação ao atingir o bloco 64. |
| RF-07 | O jogo deve travar e exibir um modal de equação ao atingir o bloco 256. |
| RF-08 | O jogo deve travar e exibir um modal de equação ao atingir o bloco 1024. |
| RF-09 | O sistema deve validar a resposta numérica do utilizador contra o banco fixo. |
| RF-10 | O sistema deve permitir o cadastro de novos utilizadores via Supabase Auth. |
| RF-11 | O sistema deve permitir o login de utilizadores existentes. |
| RF-12 | O sistema deve exibir o nome do utilizador logado no HUD do jogo. |
| RF-13 | O sistema deve enviar a pontuação final para a tabela leaderboard no término. |
| RF-14 | O sistema deve exibir um ranking Top 10 global. |
| RF-15 | O sistema deve permitir reiniciar a partida (New Game) a qualquer momento. |
| RF-16 | O sistema deve exibir uma mensagem de "Game Over" se não houver movimentos possíveis. |
| RF-17 | O sistema deve exibir uma mensagem de "You Win" ao atingir o bloco 2048. |
| RF-18 | O sistema deve permitir que o utilizador continue a jogar após o 2048 (Modo Infinito). |
| RF-19 | O sistema deve salvar o estado local da partida para evitar perda por refresh acidental. |
| RF-20 | O sistema deve fornecer um botão de Logout para encerrar a sessão. |

## 4. Requisitos Não Funcionais

### Performance
| ID | Descrição |
|---|---|
| RNF-01 | O tempo de resposta ao input (swipe/tecla) deve ser inferior a 100ms. |
| RNF-02 | O jogo deve manter uma taxa de atualização estável de 60 FPS durante as animações. |
| RNF-03 | A latência da base de dados Supabase não deve prejudicar a fluidez do processamento local. |
| RNF-04 | O uso de CPU em dispositivos mobile não deve exceder 20% em repouso. |
| RNF-05 | O tempo de carregamento inicial (Splash Screen) não deve exceder 3 segundos. |

### Segurança
| ID | Descrição |
|---|---|
| RNF-06 | Todas as comunicações com o Supabase devem utilizar protocolo HTTPS (SSL). |
| RNF-07 | As credenciais e senhas de utilizador devem ser geridas exclusivamente pelo Supabase Auth, em conformidade com a RGPD/LGPD. |
| RNF-08 | O sistema deve implementar validações para garantir a integridade dos dados de score contra manipulações triviais (scripts de console). |

### Usabilidade e Acessibilidade
| ID | Descrição |
|---|---|
| RNF-09 | A aplicação deve seguir princípios de acessibilidade, garantindo contraste adequado e legibilidade. |
| RNF-10 | O sistema deve ser estruturado para permitir internacionalização futura (i18n ready). |

### Compatibilidade e Disponibilidade
| ID | Descrição |
|---|---|
| RNF-11 | A interface deve ser totalmente responsiva, adaptando-se a resoluções de 360px (Mobile) até 1920px (Desktop). |
| RNF-12 | O sistema deve suportar até 100 requisições simultâneas ao ranking sem perda de dados. |
| RNF-13 | O jogo deve ser compatível com as versões recentes dos navegadores Chrome, Safari e Firefox. |
| RNF-14 | A aplicação deve ser tecnicamente capaz de ser empacotada como APK através do Apache Cordova. |

### Manutenibilidade e Escalabilidade
| ID | Descrição |
|---|---|
| RNF-15 | O banco de questões fixo deve ser carregado em memória no início da sessão para acesso instantâneo. |
| RNF-16 | O código deve ser estritamente modular (ES6 Modules) para facilitar a manutenção e atualizações. |
| RNF-17 | O tamanho total do pacote de ativos (assets + scripts) não deve exceder 5MB. |
| RNF-18 | O código deve passar por validação ESLint sem erros críticos antes da implantação. |
| RNF-19 | As funções principais devem ser documentadas seguindo o padrão JSDoc. |
| RNF-20 | O sistema deve possuir tratamento de erros para falhas de rede, exibindo avisos amigáveis ao utilizador. |

## 5. Visão Geral do Sistema

- **Descrição do Jogo:** Math2048 é um jogo educativo que une a mecânica viciante do puzzle 2048 com desafios matemáticos de equações de 1º grau. O jogador progride somando blocos, mas é desafiado intelectualmente em momentos críticos para desbloquear o tabuleiro.
- **Plataformas Alvo:** Web (Navegadores Desktop/Mobile) e Android (via Cordova).
- **Requisitos Mínimos de Hardware:**
  - Web: Browser moderno com suporte a ES6 e conexão estável à internet.
  - Mobile: Android 6.0+, 2GB de RAM, processador Quad-Core 1.5GHz.

## 6. Arquitetura do Sistema

- **Diagrama de Arquitetura:** Input Utilizador → Motor JS (Matriz) → Trigger de Questão (Gatekeeper) → Validação Supabase/Local → Atualização do DOM.
- **Módulos Principais:**
  - **Motor Gráfico:** Manipulação direta do DOM via JavaScript e CSS Transitions/Animations.
  - **Física:** Lógica de colisão e fusão baseada em indexação de arrays 2D.
  - **IA:** Sistema de comportamento baseado em Máquina de Estados Finitos (FSM) para alternar entre estados de jogo (Idle, Moving, Challenge, Game Over).

## 7. Tecnologias Utilizadas

- **Linguagens de Programação:** JavaScript (ES6+), HTML5, CSS3.
- **Ferramentas de Desenvolvimento:** Visual Studio Code, Git, GitHub.
- **APIs e SDKs:** Supabase JS SDK para autenticação e base de dados PostgreSQL; Cordova SDK para empacotamento mobile.

## 8. Fluxo de Trabalho

- **Versionamento:** Git com repositório no GitHub, seguindo o modelo Git Flow (Main, Develop).
- **Integração Contínua:** Uso de GitHub Actions para automação de testes de sintaxe e validação de build.
- **Testes:** Testes unitários de lógica de matriz e testes de integração com a API do Supabase.

## 9. Desafios Técnicos

- **Problemas Conhecidos:**
  - Latência na WebView do Cordova pode impactar a suavidade do swipe em dispositivos de baixo custo.
  - Sincronização de ranking pode falhar em redes instáveis.
- **Soluções Propostas:**
  - Uso de requestAnimationFrame e aceleração de hardware via CSS `transform: translate3d` para otimizar performance.
  - Implementação de uma fila de submissão local para scores não enviados por erro de rede.

## 10. Requisitos de Performance

- **Otimização:** Uso de técnicas de "Dirty Checking" para atualizar apenas os elementos do DOM que sofreram alteração na matriz.
- **Limites de Hardware:** Restrição de uso de memória em 100MB e ocupação de CPU abaixo de 15% durante o repouso.

## 11. Integração de Assets

- **Pipeline de Arte:** Criação de ícones em formato vetorial para garantir nitidez em todas as resoluções.
- **Formato de Arquivos:** PNG (Sprites), SVG (Ícones), WAV (Efeitos sonoros curtos), JSON (Banco de questões).
- **Ferramentas de Autores:** Figma (UI Design), VS Code (Edição de Código).

## 12. Cronograma Técnico

- **Milestones:**
  - M1: Motor 2048 Funcional.
  - M2: Sistema de Desafio Matemático e Banco Local.
  - M3: Integração Supabase (Auth/Ranking).
  - M4: Build Cordova e Beta Test.
- **Prazos:** Desenvolvimento estimado em 8 semanas (2 semanas por Milestone).

## 13. Referências

**Documentação Técnica:**
- MDN Web Docs. *JavaScript reference*. Disponível em: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference.
- SUPABASE. *Supabase Documentation*. Disponível em: https://supabase.com/docs.
- APACHE CORDOVA. *Cordova Documentation*. Disponível em: https://cordova.apache.org/docs/en/latest/.

**Jogos Sérios e Educação:**
- PRENSKY, Marc. *Digital Game-Based Learning*. McGraw-Hill, 2001.
- GEE, James Paul. *What Video Games Have to Teach Us About Learning and Literacy*. Palgrave Macmillan, 2003.

**Algoritmos e Lógica:**
- CIRULLI, Gabriele. *The original 2048 source code*. GitHub. Disponível em: https://github.com/gabrielecirulli/2048.
- KNUTH, Donald E. *The Art of Computer Programming*. Addison-Wesley, 2011.
