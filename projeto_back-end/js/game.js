"use strict";

/*
 * CENTRAL DE AJUSTES DA PARTIDA
 * Altere estes valores para equilibrar o jogo sem procurar números pelo arquivo.
 */
/*
 * PASSO 32 — Cada tipo reúne suas próprias características.
 * Para criar outro tipo, copie um bloco e altere os valores.
 */
const TIPOS_INIMIGOS = Object.freeze({
    rapido: {
        nome: "RÁPIDO",
        vida: 60,
        danoContato: 7,
        velocidade: 180,
        alcanceDeteccao: 720,
        raio: 18,
        cor: 0x2ed573
    },
    soldado: {
        nome: "SOLDADO",
        vida: 100,
        danoContato: 10,
        velocidade: 120,
        alcanceDeteccao: 700,
        raio: 25,
        cor: 0x9b59b6
    },
    tanque: {
        nome: "TANQUE",
        vida: 180,
        danoContato: 17,
        velocidade: 78,
        alcanceDeteccao: 620,
        raio: 32,
        cor: 0xf39c12
    },
    bruto: {
        nome: "BRUTO",
        vida: 260,
        danoContato: 26,
        velocidade: 58,
        alcanceDeteccao: 540,
        raio: 38,
        cor: 0xe74c3c
    }
});

/*
 * PASSO 31 — Esta lista define quem nasce no mapa e onde.
 * Para adicionar um inimigo, inclua outra linha com tipo, x e y.
 */
const INIMIGOS_INICIAIS = Object.freeze([
    { tipo: "rapido", x: 1120, y: 620 },
    { tipo: "soldado", x: 1420, y: 610 },
    { tipo: "rapido", x: 1760, y: 400 },
    { tipo: "tanque", x: 1680, y: 1120 },
    { tipo: "bruto", x: 2300, y: 1450 }
]);

/*
 * PASSOS 33 a 40 — Catálogo de armas.
 * Cada arma leva consigo dano, cadência e comportamento de disparo.
 */
const ARMAS = Object.freeze({
    pistola: {
        nome: "PISTOLA",
        tipoDisparo: "SEMIAUTOMÁTICA",
        automatico: false,
        dano: 25,
        intervaloTiro: 350,
        velocidadeBala: 720,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0xffe66d,
        cadencia: "BAIXA"
    },
    rifle: {
        nome: "RIFLE",
        tipoDisparo: "AUTOMÁTICO",
        automatico: true,
        dano: 30,
        intervaloTiro: 140,
        velocidadeBala: 900,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0x54a0ff,
        cadencia: "MÉDIA"
    },
    smg: {
        nome: "SMG",
        tipoDisparo: "AUTOMÁTICA",
        automatico: true,
        dano: 17,
        intervaloTiro: 80,
        velocidadeBala: 780,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0xa29bfe,
        cadencia: "ALTA"
    },
    escopeta: {
        nome: "ESCOPETA",
        tipoDisparo: "SEMIAUTOMÁTICA",
        automatico: false,
        dano: 12,
        intervaloTiro: 700,
        velocidadeBala: 580,
        projeteisPorTiro: 6,
        dispersaoGraus: 22,
        corProjetil: 0xff9f43,
        cadencia: "BAIXA"
    },
    sniper: {
        nome: "SNIPER",
        tipoDisparo: "SEMIAUTOMÁTICA",
        automatico: false,
        dano: 100,
        intervaloTiro: 950,
        velocidadeBala: 1200,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0xff4757,
        cadencia: "MUITO BAIXA"
    }
});

const CONFIGURACAO_PARTIDA = {
    larguraMapa: 3000,
    alturaMapa: 2000,
    vidaInicialJogador: 100,
    intervaloDanoJogador: 1000,
    velocidadeJogador: 250,
    velocidadeCorrida: 400,
    armaInicial: "pistola",
    // Um jogador + todos os inimigos cadastrados na lista acima.
    jogadoresIniciais: INIMIGOS_INICIAIS.length + 1
};

let jogador;
let teclas;
let balas;
let obstaculos;
let inimigos;
let ultimaDirecao = "baixo";
let armaAtual = CONFIGURACAO_PARTIDA.armaInicial;
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
    armaAtual: document.getElementById("arma-atual"),
    estatisticasArma: document.getElementById("estatisticas-arma"),
    slotsArmas: document.querySelectorAll("[data-arma]"),
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
    criarInimigosIniciais(this);
    jogadoresVivos = inimigos.countActive(true) + 1;
    atualizarHUD();
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
    ultimoTiro = Number.NEGATIVE_INFINITY;
    armaAtual = CONFIGURACAO_PARTIDA.armaInicial;
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

function criarInimigosIniciais(cena) {
    inimigos = cena.physics.add.group();

    INIMIGOS_INICIAIS.forEach(({ tipo, x, y }) => {
        criarInimigo(cena, tipo, x, y);
    });
}

function criarInimigo(cena, tipoId, x, y) {
    const tipo = TIPOS_INIMIGOS[tipoId];

    if (!tipo) {
        throw new Error(`Tipo de inimigo inexistente: ${tipoId}`);
    }

    const inimigo = cena.add.circle(x, y, tipo.raio, tipo.cor);
    cena.physics.add.existing(inimigo);
    inimigo.body.setCollideWorldBounds(true);
    inimigo.body.setCircle(tipo.raio);
    inimigo.setData("tipo", tipoId);
    inimigo.setData("vida", tipo.vida);
    inimigo.setData("vidaMaxima", tipo.vida);
    inimigo.setData("danoContato", tipo.danoContato);
    inimigo.setData("velocidade", tipo.velocidade);
    inimigo.setData("alcanceDeteccao", tipo.alcanceDeteccao);

    // O rótulo facilita enxergar qual tipo de inimigo está sendo testado.
    const rotulo = cena.add.text(x, y - tipo.raio - 14, tipo.nome, {
        color: "#ffffff",
        fontFamily: "Arial",
        fontSize: "10px",
        fontStyle: "bold"
    }).setOrigin(0.5);

    inimigo.setData("rotulo", rotulo);
    inimigos.add(inimigo);

    return inimigo;
}

function configurarColisoes(cena) {
    // Passo 24 e 25: o contato causa dano no jogador, com intervalo para não esvaziar a vida instantaneamente.
    cena.physics.add.overlap(jogador, inimigos, (_jogador, inimigo) => causarDanoNoJogador(cena, inimigo));
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
        arma1: Phaser.Input.Keyboard.KeyCodes.ONE,
        arma2: Phaser.Input.Keyboard.KeyCodes.TWO,
        arma3: Phaser.Input.Keyboard.KeyCodes.THREE,
        arma4: Phaser.Input.Keyboard.KeyCodes.FOUR,
        arma5: Phaser.Input.Keyboard.KeyCodes.FIVE
    });
}

function atualizarJogo() {
    if (jogoEncerrado) {
        return;
    }

    movimentarJogador();
    atualizarTrocaDeArma();
    atualizarDisparo(this);
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

/*
 * Seleção temporária para testar os passos 34 a 38.
 * Inventário, slots reais e loot serão construídos apenas nos passos 46 a 53.
 */
function atualizarTrocaDeArma() {
    const selecoes = [
        [teclas.arma1, "pistola"],
        [teclas.arma2, "rifle"],
        [teclas.arma3, "smg"],
        [teclas.arma4, "escopeta"],
        [teclas.arma5, "sniper"]
    ];

    selecoes.forEach(([tecla, idArma]) => {
        if (Phaser.Input.Keyboard.JustDown(tecla)) {
            armaAtual = idArma;
            ultimoTiro = Number.NEGATIVE_INFINITY;
            atualizarHUD();
        }
    });
}

function atualizarDisparo(cena) {
    const arma = ARMAS[armaAtual];
    const apertouGatilho = arma.automatico
        ? teclas.atirar.isDown
        : Phaser.Input.Keyboard.JustDown(teclas.atirar);

    const podeAtirar = cena.time.now >= ultimoTiro + arma.intervaloTiro;

    if (!apertouGatilho || !podeAtirar) {
        return;
    }

    dispararArma(cena, arma);
    ultimoTiro = cena.time.now;
}

function dispararArma(cena, arma) {
    const anguloBase = anguloDaUltimaDirecao();

    for (let indice = 0; indice < arma.projeteisPorTiro; indice += 1) {
        const desvio = arma.projeteisPorTiro === 1
            ? 0
            : Phaser.Math.DegToRad(
                Phaser.Math.FloatBetween(-arma.dispersaoGraus / 2, arma.dispersaoGraus / 2)
            );

        criarProjetil(cena, arma, anguloBase + desvio);
    }
}

function anguloDaUltimaDirecao() {
    const angulos = {
        cima: -Math.PI / 2,
        baixo: Math.PI / 2,
        esquerda: Math.PI,
        direita: 0
    };

    return angulos[ultimaDirecao];
}

function criarProjetil(cena, arma, angulo) {
    const raioProjetil = arma.projeteisPorTiro > 1 ? 4 : 6;
    const bala = cena.add.circle(jogador.x, jogador.y, raioProjetil, arma.corProjetil);
    cena.physics.add.existing(bala);
    bala.body.setCollideWorldBounds(true);
    bala.body.onWorldBounds = true;
    bala.setData("dano", arma.dano);
    bala.setData("arma", arma.nome);
    balas.add(bala);

    bala.body.setVelocity(
        Math.cos(angulo) * arma.velocidadeBala,
        Math.sin(angulo) * arma.velocidadeBala
    );
}

function atualizarInimigos(cena) {
    inimigos.children.iterate((inimigo) => {
        if (!inimigo || !inimigo.active) {
            return;
        }

        const distancia = Phaser.Math.Distance.Between(inimigo.x, inimigo.y, jogador.x, jogador.y);
        const rotulo = inimigo.getData("rotulo");

        if (rotulo) {
            rotulo.setPosition(inimigo.x, inimigo.y - inimigo.displayHeight / 2 - 14);
        }

        if (distancia < inimigo.getData("alcanceDeteccao")) {
            cena.physics.moveToObject(inimigo, jogador, inimigo.getData("velocidade"));
        } else {
            inimigo.body.setVelocity(0, 0);
        }
    });
}

function causarDanoNoJogador(cena, inimigo) {
    const podeReceberDano = cena.time.now > ultimoDanoJogador + CONFIGURACAO_PARTIDA.intervaloDanoJogador;

    if (jogoEncerrado || !podeReceberDano) {
        return;
    }

    const danoContato = inimigo.getData("danoContato");
    vidaJogador = Math.max(0, vidaJogador - danoContato);
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

    const danoDaBala = bala.getData("dano");
    const vidaAtual = inimigo.getData("vida") - danoDaBala;
    inimigo.setData("vida", vidaAtual);

    if (vidaAtual <= 0) {
        const rotulo = inimigo.getData("rotulo");

        if (rotulo) {
            rotulo.destroy();
        }

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
    atualizarHUDDaArma();
}

function atualizarHUDDaArma() {
    const arma = ARMAS[armaAtual];

    interfacePartida.armaAtual.textContent = arma.nome;
    interfacePartida.estatisticasArma.textContent =
        `${arma.tipoDisparo} · DANO ${arma.dano} · CADÊNCIA ${arma.cadencia}`;

    interfacePartida.slotsArmas.forEach((slot) => {
        slot.classList.toggle("slot-arma--ativa", slot.dataset.arma === armaAtual);
    });
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
