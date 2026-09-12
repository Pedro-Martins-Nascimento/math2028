# Math2048 — Game Design Document (GDD)

**Versão:** 1.0
**Autores:** Felipe Vieira, Júlia Paz e Silva, Klaus Christoph Emmerich Jourdain, Lucas Montimór Soares Barra, Pedro Martins do Nascimento
**Local/Data:** Jaraguá do Sul, Junho de 2026

---

## 1. História

O Math2048 se passa em um universo numérico abstrato e minimalista, onde o jogador assume o papel de um estudante-desafiante em busca da glória matemática. O mundo é delimitado por uma matriz geométrica de 4x4, um espaço digital onde números ganham vida, se movem e se fundem conforme a lógica do jogador. A jornada começa com o tabuleiro vazio, que ganha vida ao ser inicializado com dois blocos aleatórios de valor 2 ou 4, e o estudante dá seus primeiros passos nesse universo aprendendo a dominar o movimento e a fusão dos blocos.

À medida que o jogador avança, os blocos crescem em valor e o tabuleiro vai ficando mais denso e desafiador. Nos momentos críticos, ao atingir os blocos 16, 64, 256 e 1024, o mundo congela e o Gatekeeper se manifesta: uma entidade abstrata que impõe equações de 1º grau como condição obrigatória para desbloquear o tabuleiro. Esses são os chamados Portais de Gatekeeping, as barreiras entre o conhecimento superficial e a maestria matemática.

O destino do jogador pode ter dois desfechos. Se o tabuleiro se encher sem movimentos possíveis, o Apocalipse se instala e o Game Over encerra a jornada. Mas se o estudante-desafiante conseguir fundir os blocos até alcançar o valor 2048, ele atinge a Ascensão, conquistando a glória matemática e entrando no Modo Infinito, onde pode continuar desafiando seus próprios limites.

## 2. Gameplay

A mecânica central do Math2048 é baseada no clássico puzzle 2048, onde o jogador controla uma matriz 4x4 deslizando os blocos numéricos nas quatro direções cardeais — norte, sul, leste e oeste — por meio de gestos de swipe em dispositivos móveis ou pelas teclas direcionais no desktop. Quando dois blocos de mesmo valor colidem, eles se fundem em um único bloco com o dobro do valor, e um novo bloco de valor 2 ou 4 é gerado automaticamente no tabuleiro após cada movimento válido.

O principal desafio do jogo está na combinação entre a estratégia espacial do tabuleiro e os Portais de Gatekeeping matemático. Ao atingir pela primeira vez os blocos de valor 16, 64, 256 e 1024, o tabuleiro é imediatamente congelado e um modal de equação de 1º grau é exibido ao jogador. O tabuleiro permanece bloqueado até que a resposta correta seja fornecida, exigindo raciocínio lógico-matemático como condição obrigatória para prosseguir.

O sistema de recompensas é baseado em pontuação, que aumenta a cada fusão realizada. Ao final da partida, a pontuação máxima é registrada em um ranking global Top 10 via Supabase, permitindo que o jogador compare seu desempenho com outros competidores. A condição de vitória é alcançar o bloco 2048, momento em que o jogo exibe a mensagem "You Win" e libera o Modo Infinito para quem desejar continuar. A condição de derrota ocorre quando o tabuleiro está completamente preenchido e não há movimentos ou fusões possíveis, encerrando a partida com a mensagem de Game Over.

## 3. Personagens

O Math2048 possui um elenco enxuto de personagens, condizente com sua proposta minimalista e focada na experiência matemática. O personagem principal é o próprio jogador, identificado no HUD pelo seu nome de usuário cadastrado via Supabase Auth. Não há um avatar visual definido, pois a identidade do jogador é representada pelo seu desempenho no tabuleiro e pela sua posição no ranking global.

O único NPC presente no jogo é o Gatekeeper, uma entidade abstrata que se manifesta nos momentos críticos do tabuleiro ao serem atingidos os blocos 16, 64, 256 e 1024. O Gatekeeper não possui forma física definida, sendo representado pelo modal de desafio matemático que sobrepõe o tabuleiro, impondo equações de 1º grau como condição obrigatória para o desbloqueio do mundo. Ele representa a barreira entre o conhecimento superficial e a maestria matemática, sendo o principal antagonista da jornada do jogador.

Por fim, os blocos numéricos — de valor 2, 4, 8 até 2048 — podem ser considerados a população geral do universo do jogo, elementos que se movem, colidem e se fundem conforme os comandos do jogador, compondo o ambiente vivo e dinâmico da matriz 4x4.

## 4. Controles

O Math2048 é um jogo desenvolvido primariamente para web, acessível via navegador desktop e mobile, e empacotado para Android via Apache Cordova. No desktop, o controle é realizado pelas teclas direcionais do teclado, onde a seta para cima move os blocos para o norte, para baixo para o sul, para a direita para o leste e para a esquerda para o oeste. Em dispositivos móveis, seja pelo navegador ou pelo aplicativo Android, o jogador realiza gestos de swipe na tela touchscreen nas mesmas quatro direções, ou alternativamente utiliza o toque direto nos botões direcionais da interface.

Durante os Portais de Gatekeeping, o controle muda temporariamente: o tabuleiro é bloqueado e o jogador interage exclusivamente com o modal de equação, digitando a resposta numérica no campo disponível e confirmando via botão Confirmar. O tabuleiro só retorna ao controle normal após a resposta correta ser fornecida. Além dos controles de movimento, o jogador dispõe do botão Novo Jogo para reiniciar a partida a qualquer momento e do botão Logout na aba Conta para encerrar a sessão.

## 5. Câmera

O Math2048 não possui um sistema de câmera tradicional, o que é justificado pela natureza do jogo. Por se tratar de um jogo de puzzle 2D desenvolvido inteiramente em HTML5 e CSS3 com renderização direta no DOM, não há necessidade de uma câmera dinâmica ou perspectiva tridimensional. Toda a ação acontece em uma única tela fixa, onde o tabuleiro 4x4 é exibido de forma centralizada na interface, com visão superior estática e completa do campo de jogo.

Essa escolha é intencional e alinhada com a proposta minimalista do projeto, garantindo leveza técnica, compatibilidade com dispositivos móveis antigos e foco total na experiência matemática sem distrações visuais desnecessárias, conforme definido na direção de arte do WDD.

## 6. Universo do Jogo

O universo do Math2048 é um ambiente digital minimalista e abstrato, delimitado por uma matriz geométrica de 4x4 que representa o único espaço físico do jogo. O mundo é dividido em dois estados distintos que definem a experiência do jogador: o Estado Fluido, onde o tabuleiro está em movimento livre e os blocos se fundem livremente conforme os comandos do jogador, e o Estado Bloqueado, onde o tabuleiro congela e um modal de equação matemática — o Portal de Gatekeeping — sobrepõe o mapa, exigindo resolução imediata para que o mundo seja desbloqueado.

A atmosfera do universo é ditada pela densidade do tabuleiro. Nos momentos iniciais, com poucos blocos na matriz, o ambiente transmite leveza e fluidez. À medida que o tabuleiro vai se enchendo e os movimentos possíveis vão diminuindo, a tensão aumenta progressivamente, aproximando o jogador do Game Over. Essa dinâmica cria uma experiência emocional de pressão crescente sem necessidade de elementos visuais dramáticos.

A paleta de cores segue uma progressão visual intencional: tons pastel suaves para os blocos de baixo valor como 2, 4 e 8, cores quentes e vibrantes para os blocos intermediários como 16, 64 e 128, e tons dourados e brilhantes para os blocos de alta pontuação como 1024 e 2048. A trilha sonora segue o estilo Lo-Fi e música ambiente minimalista, estimulando a concentração durante os desafios. Os efeitos sonoros incluem um som suave de deslize ao mover blocos, um som harmônico de fusão ao juntar blocos de mesmo valor, um alerta ao abrir o modal de equação, uma fanfarra curta de vitória e um som grave de derrota.

**Mockups de referência (descritos no documento original):**
- Tela principal: HUD com "Pontos" e "Recorde" no topo, botão "Novo Jogo", tabuleiro 4x4 com blocos coloridos (2, 4, 8 em tons claros; 64 em vermelho; 256, 1024 em dourado/laranja), texto de instrução "Junte os números e chegue ao bloco 2048! Use as setas ou deslize para mover os blocos.", navegação inferior com abas Jogar/Ranking/Conta.
- Modal de desafio: "DESAFIO DE CHECKPOINT — Resolva para Continuar", exibição da equação (ex: "2x + 4 = 10"), campo "Digite o valor de x", botão "Confirmar", aviso "Uma resposta correta é necessária para fundir blocos de nível superior."

## 7. Inimigos

Math2048 não possui inimigos no sentido tradicional do termo, o que é justificado pela natureza do jogo como um puzzle educativo sem combate direto. O único antagonista presente é o Gatekeeper, uma entidade abstrata que não age de forma autônoma, mas se manifesta automaticamente nos momentos críticos do tabuleiro ao serem atingidos os blocos 16, 64, 256 e 1024.

O Gatekeeper aparece em todos os ambientes do jogo, pois está diretamente vinculado ao progresso do tabuleiro e não a uma fase ou cenário específico. Ele é superado exclusivamente através da resolução correta de uma equação de 1º grau retirada do banco de dados estático em JSON. Enquanto a resposta correta não for fornecida, o tabuleiro permanece completamente bloqueado, impedindo qualquer avanço. Não há recompensa em pontos ao superar o Gatekeeper, porém o benefício é o desbloqueio imediato do tabuleiro, permitindo que o jogador continue sua jornada rumo ao bloco 2048.

O verdadeiro inimigo do jogador, portanto, é o próprio tabuleiro: a falta de espaço na matriz 4x4 limita as decisões táticas e pressiona o jogador a cada movimento, tornando a gestão do espaço tão desafiadora quanto a resolução das equações matemáticas.

## 8. Interface

A interface do Math2048 segue o estilo Flat Design minimalista, desenvolvida inteiramente em HTML5 e CSS3 com layout responsivo baseado em Flexbox e Grid, garantindo compatibilidade desde resoluções de 360px em dispositivos móveis até 1920px em desktops.

O HUD principal exibe de forma centralizada e limpa o tabuleiro 4x4 como elemento central da tela, acompanhado pelo placar atual da partida, pelo recorde pessoal do jogador (High Score) e pelo nome do usuário autenticado via Supabase Auth. Todos esses elementos são posicionados ao redor do tabuleiro sem poluir visualmente o campo de jogo, mantendo o foco do jogador na matriz.

O jogo conta ainda com as seguintes telas e elementos de interface: a tela inicial de login e cadastro, onde o jogador se autentica via Supabase Auth antes de acessar o jogo; o modal de desafio do Gatekeeper, que sobrepõe o tabuleiro nos momentos críticos exibindo a equação de 1º grau e um campo para inserção da resposta; a tela de Game Over, exibida quando não há movimentos possíveis; a mensagem de Você Venceu, exibida ao atingir o bloco 2048 com a opção de continuar no Modo Infinito; o botão Novo Jogo para reiniciar a partida a qualquer momento; o botão Sair para encerrar a sessão; e a tela de Leaderboard, que exibe o ranking global Top 10 em tempo real via Supabase.

**Mockups de referência (descritos no documento original):**
- Tela de Leaderboard: "Ranking Global — Top 10 Arquitetos", posição do jogador e recorde no topo, lista numerada de jogadores com nome e pontos.
- Tela de "Você Venceu": troféu, mensagem "Excelência matemática alcançada. Você atingiu o lendário bloco 2048.", pontuação final em destaque, botão "Modo Infinito" e botão "Novo Jogo".
- Tela de Game Over: "A progressão matemática atingiu seu limite. Sua estratégia foi formidável.", pontuação final, botão "Reiniciar", frase motivacional final ("A essência da matemática reside na sua liberdade de alcançar o impossível.").

## 9. Cutscenes

O Math2048 não possui cutscenes ou sequências cinematográficas, o que é uma decisão intencional e tecnicamente justificada. Por se tratar de um jogo educativo desenvolvido em HTML5 e CSS3 com foco em leveza e compatibilidade, a inclusão de vídeos ou animações elaboradas comprometeria o limite máximo de 5MB definido para o pacote total de ativos do projeto, além de impactar negativamente a performance em dispositivos móveis de baixo custo que compõem parte do público-alvo.

Toda a narrativa do jogo é transmitida de forma implícita através da própria mecânica e da progressão visual do tabuleiro, dispensando a necessidade de roteiros ou filmes. A tensão crescente à medida que o tabuleiro se enche, a manifestação do Gatekeeper nos momentos críticos e a fanfarra de vitória ao atingir o bloco 2048 cumprem o papel narrativo de forma eficiente e dentro das restrições técnicas do projeto.

## 10. Cronograma

O desenvolvimento do Math2048 foi estruturado em um período de quatro meses, distribuídos entre março e junho, com tarefas organizadas semanalmente conforme o avanço do projeto.

A redação e apresentação do GDD foram as primeiras entregas do projeto, ambas concluídas nas primeiras semanas de março. Em seguida, iniciou-se a seleção e criação da arte dos personagens e dos cenários. A partir de maio, entraram as etapas de implementação técnica: desenvolvimento do sistema de controle do jogador, do motor do grid 2048, detecção de colisão e algoritmo de fusão, estruturação do banco de equações (Gatekeeper), sistema de pontuação, CSS responsivo, animações e paleta de cores progressiva.

**Tarefas registradas como concluídas no cronograma original:**
- Escrever e apresentar o GDD
- Criação dos protótipos de interface no Figma (UI Tabuleiro, HUD)
- Seleção/criação da arte dos personagens e cenários
- Estruturação de contraste e conformidade de acessibilidade (WCAG)
- Sistema de controle do jogador (Teclado/Swipes)
- Motor do grid 2048 (Matriz 4x4 em JS Puro)
- Detecção de colisão e algoritmo de fusão
- Estruturação do JSON estático com equações de 1º grau (Gatekeeper)
- Sistema de pontuação e gerenciamento de recordes locais
- CSS Responsivo (Flexbox/Grid para Mobile/Desktop)
- Animações e paleta de cores progressiva dos blocos

**Tarefas planejadas no cronograma original (posteriormente executadas — ver `math2048-master-spec.md` para status real):**
- Acoplamento do Modal de Desafio Matemático (Interrupção do Fluxo)
- Sistema de Áudio (Efeitos sonoros WAV e trilha Lo-Fi)
- Configuração do Supabase Auth (Módulo de Cadastro e Login)
- Integração com PostgreSQL para gravação do Ranking Global Top 10
- Gestão de Sessão Local (localStorage)
- Validação de integridade de dados contra manipulação de scores
- Configuração do Apache Cordova para empacotamento (.APK Android)
- Otimizações de performance (requestAnimationFrame, CPU < 20%)
- Tratamento de erros globais (falhas de rede/banco de dados)
- Garantia de Qualidade (QA): Validação ESLint e Documentação JSDoc
- Publicação da versão Beta fechada e testes de estresse (100+ reqs)
- Ajustes de jogabilidade com base no feedback dos estudantes
- Implementação do Modo Infinito pós-2048 e conquistas secundárias
- Refatoração modular de código (ES6 Modules) para manutenibilidade
- Preparação para internacionalização (Estrutura i18n ready)
- Lançamento da versão final estável (Web + APK Mobile)
- Encerramento do projeto, relatório acadêmico final e entrega do PAC

> **Nota:** o cronograma original do GDD (por semana de março a dezembro) foi substituído na prática pelo cronograma operacional do Notion (milestones M1–M4, 1 semana por tarefa, iniciado em 04/08/2026) — ver `math2048-master-spec.md`, Seção 1, para as datas reais alinhadas às entregas N1/N2/N3 do PAC IV.
