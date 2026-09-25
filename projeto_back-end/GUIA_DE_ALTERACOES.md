# Guia de alterações — Battle Arena

Os passos **25 a 30** já estão concluídos: vida do jogador, tela de eliminação, reinício, retorno ao lobby, HUD em tempo real e contador de eliminações.

Para aprender as fases atuais, comece por [AULA_31_A_40.md](AULA_31_A_40.md) e depois [AULA_41_A_50.md](AULA_41_A_50.md). Elas explicam inimigos, armas, munição, recarga, slots e loot em linguagem simples.

## Fluxo da partida

`index.html` → `loading.html` → `game.html`

- O lobby fica em `index.html`.
- A tela de carregamento redireciona automaticamente para `game.html`.
- Por isso, o botão **VOLTAR AO LOBBY** aponta para `index.html` — não para `loading.html`.

## Onde alterar cada parte

| O que você quer mudar | Arquivo | Ponto certo |
| --- | --- | --- |
| Vida inicial, velocidade do jogador e intervalo de dano | `js/game.js` | Objeto `CONFIGURACAO_PARTIDA`, no começo do arquivo |
| Vida, dano e velocidade de um tipo de inimigo | `js/game.js` | Objeto `TIPOS_INIMIGOS` |
| Criar mais inimigos | `js/game.js` | Lista `INIMIGOS_INICIAIS` |
| Dano, cadência e modo de uma arma | `js/game.js` | Objeto `ARMAS` |
| Pente, recarga e tipo de munição de uma arma | `js/game.js` | Propriedades da arma em `ARMAS` |
| Armas e munições espalhadas pelo mapa | `js/game.js` | Lista `LOOT_INICIAL` |
| Atualizar números do HUD | `js/game.js` | Função `atualizarHUD` |
| O que ocorre quando o jogador morre | `js/game.js` | Função `mostrarTelaDerrota` |
| Ação dos botões finais | `js/game.js` | Últimas linhas, eventos de `botaoReiniciar` e `botaoLobby` |
| Textos, IDs e estrutura da tela | `game.html` | Blocos `.hud`, `.hud-armas` e `#tela-derrota` |
| Cores, barra de vida, painel de armas e aparência da morte | `css/game.css` | Variáveis `:root`, `.hud`, `.hud-armas`, `.barra-vida` e `.tela-derrota` |

## Ajustes rápidos

Para tornar um tipo de inimigo mais difícil, altere estes valores dentro do bloco `bruto` já existente em `TIPOS_INIMIGOS` (sem apagar as outras propriedades):

```js
vida: 320,
danoContato: 30,
velocidade: 70,
```

Para criar outro inimigo, adicione uma linha em `INIMIGOS_INICIAIS`:

```js
{ tipo: "rapido", x: 1900, y: 760 }
```

O contador de jogadores vivos é calculado a partir dessa lista, então não é necessário alterar `jogadoresIniciais` manualmente.

## Como os passos atuais funcionam

- **25 — Vida:** contato com um inimigo reduz a vida, respeitando um intervalo de dano.
- **26 — Tela de eliminação:** ao chegar em zero, a física é pausada e a tela é exibida.
- **27 — Jogar novamente:** recarrega `game.html` e inicia uma partida limpa.
- **28 — Voltar ao lobby:** redireciona para `index.html`.
- **29 — HUD:** vida, barra de vida e jogadores vivos são atualizados pela função `atualizarHUD`.
- **30 — Eliminações:** destruir um inimigo incrementa o contador do HUD e o resumo da tela final.

## Próxima fase recomendada

Os passos **31 a 50** estão concluídos. O próximo bloco é **51 a 57**: coleta mais completa, raridade, inventário durante a partida, cura e escudo.
