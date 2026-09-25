# Guia de alterações — Battle Arena

Este projeto está no bloco **25 a 30** do roteiro: vida do jogador, tela de eliminação, reinício, retorno ao lobby, HUD em tempo real e contador de eliminações.

## Fluxo da partida

`index.html` → `loading.html` → `game.html`

- O lobby fica em `index.html`.
- A tela de carregamento redireciona automaticamente para `game.html`.
- Por isso, o botão **VOLTAR AO LOBBY** aponta para `index.html` — não para `loading.html`.

## Onde alterar cada parte

| O que você quer mudar | Arquivo | Ponto certo |
| --- | --- | --- |
| Vida inicial, dano, velocidade, cadência e quantidade de jogadores | `js/game.js` | Objeto `CONFIGURACAO_PARTIDA`, no começo do arquivo |
| A quantidade de vida perdida quando o inimigo encosta | `js/game.js` | `danoContatoInimigo` |
| A vida e o dano de cada inimigo | `js/game.js` | `vidaInimigo` e `danoBala` |
| Criar mais inimigos | `js/game.js` | Função `criarJogo`; há um exemplo ao lado de `criarInimigo` |
| Atualizar números do HUD | `js/game.js` | Função `atualizarHUD` |
| O que ocorre quando o jogador morre | `js/game.js` | Função `mostrarTelaDerrota` |
| Ação dos botões finais | `js/game.js` | Últimas linhas, eventos de `botaoReiniciar` e `botaoLobby` |
| Textos, IDs e estrutura da tela | `game.html` | Blocos `.hud` e `#tela-derrota` |
| Cores, barra de vida e aparência da morte | `css/game.css` | Variáveis `:root`, `.hud`, `.barra-vida` e `.tela-derrota` |

## Ajustes rápidos

Para tornar a partida mais difícil, use por exemplo:

```js
danoContatoInimigo: 20,
intervaloDanoJogador: 700,
velocidadeInimigo: 160,
```

Para criar outro inimigo, adicione dentro de `criarJogo`:

```js
criarInimigo(this, 1600, 900, 24, 0xff9f1c);
```

Depois, altere `jogadoresIniciais` para incluir o jogador e todos os inimigos criados. Por exemplo: jogador + 2 inimigos = `jogadoresIniciais: 3`.

## Como os passos atuais funcionam

- **25 — Vida:** contato com um inimigo reduz a vida, respeitando um intervalo de dano.
- **26 — Tela de eliminação:** ao chegar em zero, a física é pausada e a tela é exibida.
- **27 — Jogar novamente:** recarrega `game.html` e inicia uma partida limpa.
- **28 — Voltar ao lobby:** redireciona para `index.html`.
- **29 — HUD:** vida, barra de vida e jogadores vivos são atualizados pela função `atualizarHUD`.
- **30 — Eliminações:** destruir um inimigo incrementa o contador do HUD e o resumo da tela final.

## Próxima fase recomendada

Siga para os passos **31 a 40**: vários tipos de inimigos e um sistema de armas. Antes de adicionar muitas armas, vale manter cada arma em uma configuração própria para não concentrar toda a lógica em `game.js`.
