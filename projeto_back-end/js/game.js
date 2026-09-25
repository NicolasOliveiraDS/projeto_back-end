"use strict";

/*
 * CENTRAL DE AJUSTES DA PARTIDA
 * Altere estes valores para equilibrar o jogo sem procurar números pelo arquivo.
 */
const CONFIGURACAO_PARTIDA = {
    larguraMapa: 3000,
    alturaMapa: 2000,
    vidaInicialJogador: 100,
    danoContatoInimigo: 10,
    intervaloDanoJogador: 1000,
    vidaInimigo: 100,
    danoBala: 25,
    intervaloTiro: 150,
    velocidadeJogador: 250,
    velocidadeCorrida: 400,
    velocidadeInimigo: 120,
    alcanceDeteccaoInimigo: 700,
    velocidadeBala: 600,
    // Hoje há 1 jogador e 1 inimigo. Aumente ao criar novos inimigos no passo 31.
    jogadoresIniciais: 2
};

let jogador;
let teclas;
let balas;
let obstaculos;
let inimigos;
let ultimaDirecao = "baixo";
let modoDisparo = "automatico";
let ultimoTiro = 0;
let ultimoDanoJogador = Number.NEGATIVE_INFINITY;
let vidaJogador = CONFIGURACAO_PARTIDA.vidaInicialJogador;
let eliminacoes = 0;
let jogadoresVivos = CONFIGURACAO_PARTIDA.jogadoresIniciais;
let jogoEncerrado = false;

// Elementos da interface. Os IDs ficam concentrados aqui para facilitar futuras mudanças no HTML.
const interfacePartida = {
    vida: document.getElementById("vida-atual"),
    barraVida: document.getElementById("barra-vida"),
    cartaoVida: document.querySelector(".hud__item--vida"),
    jogadoresVivos: document.getElementById("jogadores-vivos"),
    eliminacoes: document.getElementById("eliminacoes-atual"),
    eliminacoesFinais: document.getElementById("eliminacoes-finais"),
    telaDerrota: document.getElementById("tela-derrota"),
    botaoReiniciar: document.getElementById("botao-reiniciar"),
    botaoLobby: document.getElementById("botao-lobby")
};

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "game-container",
    backgroundColor: "#1b2338",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: carregarArquivos,
        create: criarJogo,
        update: atualizarJogo
    }
};

const jogo = new Phaser.Game(config);

function carregarArquivos() {
    this.load.spritesheet("jogador", "assets/images/jogador.png", {
        frameWidth: 64,
        frameHeight: 64
    });
}

function criarJogo() {
    resetarEstadoDaPartida();
    configurarMundo(this);
    criarObstaculos(this);
    criarJogador(this);
    criarInimigo(this, 1100, 600, 30, 0x9b59b6);
    configurarColisoes(this);
    criarAnimacoes(this);
    configurarControles(this);

    // A câmera acompanha o jogador durante toda a partida.
    this.cameras.main.startFollow(jogador);
}

function resetarEstadoDaPartida() {
    vidaJogador = CONFIGURACAO_PARTIDA.vidaInicialJogador;
    eliminacoes = 0;
    jogadoresVivos = CONFIGURACAO_PARTIDA.jogadoresIniciais;
    ultimoDanoJogador = Number.NEGATIVE_INFINITY;
    ultimoTiro = 0;
    modoDisparo = "automatico";
    jogoEncerrado = false;

    esconderTelaDerrota();
    atualizarHUD();
}

function configurarMundo(cena) {
    cena.cameras.main.setBounds(0, 0, CONFIGURACAO_PARTIDA.larguraMapa, CONFIGURACAO_PARTIDA.alturaMapa);
    cena.physics.world.setBounds(0, 0, CONFIGURACAO_PARTIDA.larguraMapa, CONFIGURACAO_PARTIDA.alturaMapa);

    const graficos = cena.add.graphics();
    graficos.lineStyle(1, 0x2f3b5f, 0.5);

    for (let x = 0; x <= CONFIGURACAO_PARTIDA.larguraMapa; x += 100) {
        graficos.lineBetween(x, 0, x, CONFIGURACAO_PARTIDA.alturaMapa);
    }

    for (let y = 0; y <= CONFIGURACAO_PARTIDA.alturaMapa; y += 100) {
        graficos.lineBetween(0, y, CONFIGURACAO_PARTIDA.larguraMapa, y);
    }
}

function criarObstaculos(cena) {
    obstaculos = cena.add.group();

    const dadosObstaculos = [
        [900, 360, 220, 120, 0xff3b30],
        [1400, 900, 180, 180, 0x4c5b78],
        [2100, 1300, 300, 100, 0x596784]
    ];

    dadosObstaculos.forEach(([x, y, largura, altura, cor]) => {
        const obstaculo = cena.add.rectangle(x, y, largura, altura, cor);
        cena.physics.add.existing(obstaculo, true);
        obstaculos.add(obstaculo);
    });
}

function criarJogador(cena) {
    jogador = cena.physics.add.sprite(640, 360, "jogador", 0);
    jogador.setCollideWorldBounds(true);
    balas = cena.physics.add.group();

    cena.physics.add.collider(jogador, obstaculos);
}

/*
 * PASSO 31: para adicionar mais inimigos, chame esta função novamente em criarJogo.
 * Exemplo: criarInimigo(this, 1600, 900, 24, 0xff9f1c);
 */
function criarInimigo(cena, x, y, raio, cor) {
    if (!inimigos) {
        inimigos = cena.physics.add.group();
    }

    const inimigo = cena.add.circle(x, y, raio, cor);
    cena.physics.add.existing(inimigo);
    inimigo.body.setCollideWorldBounds(true);
    inimigo.setData("vida", CONFIGURACAO_PARTIDA.vidaInimigo);
    inimigos.add(inimigo);

    return inimigo;
}

function configurarColisoes(cena) {
    // Passo 24 e 25: o contato causa dano no jogador, com intervalo para não esvaziar a vida instantaneamente.
    cena.physics.add.overlap(jogador, inimigos, () => causarDanoNoJogador(cena));
    cena.physics.add.collider(inimigos, obstaculos);

    // Passos 19 a 21 e 30: cada tiro remove vida do inimigo e soma uma eliminação ao destruí-lo.
    cena.physics.add.overlap(balas, inimigos, causarDanoNoInimigo);

    cena.physics.add.collider(balas, obstaculos, (objeto1, objeto2) => {
        const bala = balas.contains(objeto1) ? objeto1 : objeto2;

        if (bala && bala.active) {
            bala.destroy();
        }
    });

    // Destrói balas que saem dos limites do mapa.
    cena.physics.world.on("worldbounds", (body) => {
        if (balas.contains(body.gameObject)) {
            body.gameObject.destroy();
        }
    });
}

function criarAnimacoes(cena) {
    const animacoes = [
        ["andar-baixo", 0, 3],
        ["andar-cima", 4, 7],
        ["andar-esquerda", 8, 11],
        ["andar-direita", 12, 15]
    ];

    animacoes.forEach(([chave, inicio, fim]) => {
        cena.anims.create({
            key: chave,
            frames: cena.anims.generateFrameNumbers("jogador", { start: inicio, end: fim }),
            frameRate: 8,
            repeat: -1
        });
    });
}

function configurarControles(cena) {
    teclas = cena.input.keyboard.addKeys({
        cima: "W",
        baixo: "S",
        esquerda: "A",
        direita: "D",
        correr: "SHIFT",
        atirar: "SPACE",
        trocarDisparo: "Q"
    });
}

function atualizarJogo() {
    if (jogoEncerrado) {
        return;
    }

    movimentarJogador();
    atualizarModoDisparo(this);
    atualizarInimigos(this);
}

function movimentarJogador() {
    const velocidade = teclas.correr.isDown
        ? CONFIGURACAO_PARTIDA.velocidadeCorrida
        : CONFIGURACAO_PARTIDA.velocidadeJogador;

    jogador.body.setVelocity(0, 0);

    let movendoHorizontal = false;
    let movendoVertical = false;

    if (teclas.cima.isDown) {
        jogador.body.setVelocityY(-velocidade);
        ultimaDirecao = "cima";
        movendoVertical = true;
    } else if (teclas.baixo.isDown) {
        jogador.body.setVelocityY(velocidade);
        ultimaDirecao = "baixo";
        movendoVertical = true;
    }

    if (teclas.esquerda.isDown) {
        jogador.body.setVelocityX(-velocidade);
        ultimaDirecao = "esquerda";
        movendoHorizontal = true;
    } else if (teclas.direita.isDown) {
        jogador.body.setVelocityX(velocidade);
        ultimaDirecao = "direita";
        movendoHorizontal = true;
    }

    jogador.body.velocity.normalize().scale(velocidade);
    atualizarAnimacaoJogador(movendoHorizontal, movendoVertical);
}

function atualizarAnimacaoJogador(movendoHorizontal, movendoVertical) {
    if (movendoHorizontal) {
        jogador.anims.play(teclas.esquerda.isDown ? "andar-esquerda" : "andar-direita", true);
        return;
    }

    if (movendoVertical) {
        jogador.anims.play(teclas.cima.isDown ? "andar-cima" : "andar-baixo", true);
        return;
    }

    jogador.anims.stop();

    const quadrosParados = {
        baixo: 0,
        cima: 4,
        esquerda: 8,
        direita: 12
    };

    jogador.setFrame(quadrosParados[ultimaDirecao]);
}

function atualizarModoDisparo(cena) {
    if (Phaser.Input.Keyboard.JustDown(teclas.trocarDisparo)) {
        modoDisparo = modoDisparo === "automatico" ? "semiautomatico" : "automatico";
        console.log(`Modo de disparo: ${modoDisparo.toUpperCase()}`);
    }

    if (modoDisparo === "semiautomatico" && Phaser.Input.Keyboard.JustDown(teclas.atirar)) {
        criarDisparo(cena);
    }

    if (
        modoDisparo === "automatico" &&
        teclas.atirar.isDown &&
        cena.time.now > ultimoTiro + CONFIGURACAO_PARTIDA.intervaloTiro
    ) {
        criarDisparo(cena);
        ultimoTiro = cena.time.now;
    }
}

function criarDisparo(cena) {
    const bala = cena.add.circle(jogador.x, jogador.y, 6, 0xffff00);
    cena.physics.add.existing(bala);
    bala.body.setCollideWorldBounds(true);
    bala.body.onWorldBounds = true;
    balas.add(bala);

    const velocidade = CONFIGURACAO_PARTIDA.velocidadeBala;
    const direcoes = {
        cima: [0, -velocidade],
        baixo: [0, velocidade],
        esquerda: [-velocidade, 0],
        direita: [velocidade, 0]
    };

    const [velocidadeX, velocidadeY] = direcoes[ultimaDirecao];
    bala.body.setVelocity(velocidadeX, velocidadeY);
}

function atualizarInimigos(cena) {
    inimigos.children.iterate((inimigo) => {
        if (!inimigo || !inimigo.active) {
            return;
        }

        const distancia = Phaser.Math.Distance.Between(inimigo.x, inimigo.y, jogador.x, jogador.y);

        if (distancia < CONFIGURACAO_PARTIDA.alcanceDeteccaoInimigo) {
            cena.physics.moveToObject(inimigo, jogador, CONFIGURACAO_PARTIDA.velocidadeInimigo);
        } else {
            inimigo.body.setVelocity(0, 0);
        }
    });
}

function causarDanoNoJogador(cena) {
    const podeReceberDano = cena.time.now > ultimoDanoJogador + CONFIGURACAO_PARTIDA.intervaloDanoJogador;

    if (jogoEncerrado || !podeReceberDano) {
        return;
    }

    vidaJogador = Math.max(0, vidaJogador - CONFIGURACAO_PARTIDA.danoContatoInimigo);
    ultimoDanoJogador = cena.time.now;
    atualizarHUD();
    cena.cameras.main.shake(90, 0.004);

    if (vidaJogador === 0) {
        jogadoresVivos = Math.max(0, jogadoresVivos - 1);
        atualizarHUD();
        mostrarTelaDerrota(cena);
    }
}

function causarDanoNoInimigo(objeto1, objeto2) {
    const bala = balas.contains(objeto1) ? objeto1 : objeto2;
    const inimigo = inimigos.contains(objeto1) ? objeto1 : objeto2;

    if (!bala || !inimigo || !bala.active || !inimigo.active) {
        return;
    }

    bala.destroy();

    const vidaAtual = inimigo.getData("vida") - CONFIGURACAO_PARTIDA.danoBala;
    inimigo.setData("vida", vidaAtual);

    if (vidaAtual <= 0) {
        inimigo.destroy();
        eliminacoes += 1;
        jogadoresVivos = Math.max(1, jogadoresVivos - 1);
        atualizarHUD();
    }
}

/* Passo 29 e 30: um único lugar atualiza todos os números mostrados na tela. */
function atualizarHUD() {
    const percentualVida = (vidaJogador / CONFIGURACAO_PARTIDA.vidaInicialJogador) * 100;

    interfacePartida.vida.textContent = vidaJogador;
    interfacePartida.barraVida.style.setProperty("--vida-percentual", `${percentualVida}%`);
    interfacePartida.barraVida.setAttribute("aria-valuenow", vidaJogador);
    interfacePartida.cartaoVida.classList.toggle("vida-baixa", percentualVida <= 30);
    interfacePartida.jogadoresVivos.textContent = jogadoresVivos;
    interfacePartida.eliminacoes.textContent = eliminacoes;
    interfacePartida.eliminacoesFinais.textContent = eliminacoes;
}

function mostrarTelaDerrota(cena) {
    if (jogoEncerrado) {
        return;
    }

    jogoEncerrado = true;
    jogador.body.setVelocity(0, 0);
    jogador.anims.stop();
    cena.physics.pause();

    interfacePartida.telaDerrota.classList.add("visivel");
    interfacePartida.telaDerrota.setAttribute("aria-hidden", "false");
    interfacePartida.botaoReiniciar.focus();
}

function esconderTelaDerrota() {
    interfacePartida.telaDerrota.classList.remove("visivel");
    interfacePartida.telaDerrota.setAttribute("aria-hidden", "true");
}

// Passos 27 e 28: reinicia a arena ou volta ao lobby inicial.
interfacePartida.botaoReiniciar.addEventListener("click", () => window.location.reload());
interfacePartida.botaoLobby.addEventListener("click", () => {
    window.location.href = "index.html";
});
