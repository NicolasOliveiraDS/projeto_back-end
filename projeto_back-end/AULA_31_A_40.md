# Aula prática: passos 31 a 40

Não precisa decorar o arquivo inteiro. Para esta fase, você só precisa conhecer **três blocos no começo de `js/game.js`**.

## 1. Tipos de inimigo — passo 32

Procure por `TIPOS_INIMIGOS`.

Cada bloco é uma receita de inimigo. Por exemplo, o tanque tem muita vida e pouca velocidade:

```js
tanque: {
    nome: "TANQUE",
    vida: 180,
    danoContato: 17,
    velocidade: 78,
    raio: 32,
    cor: 0xf39c12
}
```

Se quiser um tanque mais difícil, altere apenas `vida` para `300`. Não altere a função de colisão para isso.

## 2. Quantidade de inimigos — passo 31

Procure por `INIMIGOS_INICIAIS`.

Cada linha cria um inimigo no mapa:

```js
{ tipo: "tanque", x: 1680, y: 1120 }
```

- `tipo`: precisa ser um nome que exista em `TIPOS_INIMIGOS`.
- `x`: posição horizontal no mapa.
- `y`: posição vertical no mapa.

Para adicionar outro inimigo rápido, copie uma linha e mude a posição:

```js
{ tipo: "rapido", x: 1900, y: 760 }
```

## 3. Armas — passos 33 a 40

Procure por `ARMAS`.

Exemplo da sniper:

```js
sniper: {
    nome: "SNIPER",
    dano: 100,
    intervaloTiro: 950,
    projeteisPorTiro: 1
}
```

- `dano` é o quanto cada projétil tira de vida.
- `intervaloTiro` é o tempo mínimo entre tiros, em milissegundos. Quanto menor, mais rápida é a arma.
- `projeteisPorTiro` é quantas balas saem em um disparo. A escopeta usa 6.
- `dispersaoGraus` abre os projéteis da escopeta.
- `automatico: true` permite segurar Espaço; `false` exige apertar Espaço a cada tiro.

## Como testar no jogo

1. Mova com `W`, `A`, `S` e `D`.
2. Use `1` para pistola, `2` para rifle, `3` para SMG, `4` para escopeta e `5` para sniper.
3. Dispare com `Espaço`.
4. Rifle e SMG: segure Espaço. Pistola, escopeta e sniper: aperte Espaço a cada tiro.

O painel no canto inferior direito mostra a arma atual, dano e cadência. Os inimigos têm rótulos para você enxergar os tipos diferentes.

## Exercício simples

Altere a sniper de `dano: 100` para `dano: 150`, salve e recarregue o jogo. Ela deverá eliminar um inimigo rápido com um tiro e ficar mais forte contra tanques.

Depois, volte para `100` se quiser manter o equilíbrio inicial.

## O que cada passo do roteiro virou no código

| Passo | Onde está |
| --- | --- |
| 31 — vários inimigos | `INIMIGOS_INICIAIS` |
| 32 — tipos de inimigos | `TIPOS_INIMIGOS` |
| 33 — sistema de armas | `ARMAS`, `atualizarDisparo` e `dispararArma` |
| 34–38 — cinco armas | Blocos `pistola`, `rifle`, `smg`, `escopeta` e `sniper` |
| 39 — dano diferente | Propriedade `dano` de cada arma, guardada em cada projétil |
| 40 — cadência diferente | Propriedade `intervaloTiro` de cada arma |

Ainda não há munição, recarga, inventário ou loot. Esses recursos começam no passo 41.
