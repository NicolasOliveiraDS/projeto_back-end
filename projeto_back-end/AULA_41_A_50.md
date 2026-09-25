# Aula prática: passos 41 a 50

Nesta fase, o jogo deixa de liberar todas as armas de uma vez. Você começa com a pistola, encontra itens no mapa e monta os seus slots.

## Como testar no jogo

1. Dispare a pistola com `Espaço`: o número de **PENTE** diminui.
2. Quando o pente não estiver cheio, aperte `R`: a barra azul mostra a recarga.
3. Caminhe até um item escrito no mapa e aperte `E` quando aparecer o aviso de coleta.
4. Armas ocupam o próximo slot vazio; munições vão para a reserva.
5. Use `1` até `5` para trocar apenas entre slots que tenham arma.
6. No PC/notebook, o ícone de casa no topo esquerdo retorna ao lobby.

## As três partes que você pode alterar

### 1. Regras de cada arma

No começo de `js/game.js`, procure `ARMAS`.

```js
rifle: {
    tipoMunicao: "rifle",
    capacidadePente: 30,
    tempoRecarga: 1400
}
```

- `tipoMunicao`: qual reserva a arma usa.
- `capacidadePente`: máximo de tiros carregados.
- `tempoRecarga`: duração da recarga, em milissegundos.

Exemplo: para deixar a sniper com 8 balas no pente, altere apenas `capacidadePente: 5` para `capacidadePente: 8` dentro do bloco `sniper`.

### 2. Itens espalhados pelo mapa

Procure `LOOT_INICIAL`.

```js
{ tipo: "arma", armaId: "rifle", x: 1200, y: 500 },
{ tipo: "municao", tipoMunicao: "rifle", quantidade: 60, x: 1260, y: 570 },
```

- `tipo: "arma"` cria uma arma coletável.
- `tipo: "municao"` cria munição coletável.
- `x` e `y` definem o lugar no mapa.

Para criar mais munição leve, copie uma linha de munição e altere `quantidade`, `x` e `y`.

### 3. Inventário inicial

Procure a função `criarInventarioInicial()`.

Ela define que o jogador começa com uma pistola carregada e 36 munições leves de reserva. Os outros quatro slots começam vazios.

## O que cada passo virou no código

| Passo | Implementação |
| --- | --- |
| 41 — sistema de munição | `TIPOS_MUNICAO` e `inventarioArmas.reserva` |
| 42 — pente | `inventarioArmas.pentes` e `capacidadePente` |
| 43 — munição reserva | Objeto `reserva`, separado do pente |
| 44 — recarga | `iniciarRecarga` e `concluirRecarga` |
| 45 — tecla R | `recarregar: "R"` em `configurarControles` |
| 46 — troca de armas | `selecionarSlotDeArma` com as teclas 1–5 |
| 47 — slots | `inventarioArmas.slots` e o painel inferior direito |
| 48 — loot | `atualizarLoot` e a tecla `E` |
| 49 — armas no mapa | Entradas `tipo: "arma"` em `LOOT_INICIAL` |
| 50 — munição no mapa | Entradas `tipo: "municao"` em `LOOT_INICIAL` |

## Exercício simples

Altere a quantidade da munição de rifle de `60` para `120`, salve e recarregue a página. Depois pegue o rifle, aperte `R` e veja a reserva sendo transferida para o pente.

O próximo bloco começa no passo 51: pegar itens de forma mais completa, raridade e inventário durante a partida.
