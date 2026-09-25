"use strict";

/*
 * PASSO 32 — Tipos de inimigo.
 * Para criar outro tipo, copie um bloco e altere somente os seus valores.
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

/* PASSO 31 — Posições dos inimigos que nascem na arena. */
const INIMIGOS_INICIAIS = Object.freeze([
    { tipo: "rapido", x: 1120, y: 620 },
    { tipo: "soldado", x: 1420, y: 610 },
    { tipo: "rapido", x: 1760, y: 400 },
    { tipo: "tanque", x: 1680, y: 1120 },
    { tipo: "bruto", x: 2300, y: 1450 }
]);

/*
 * PASSOS 41 a 43 — Tipos de munição.
 * A reserva pertence ao tipo de munição, não a uma arma específica.
 * Exemplo: pistola e SMG dividem munição leve.
 */
const TIPOS_MUNICAO = Object.freeze({
    leve: { nome: "MUNIÇÃO LEVE", cor: 0xf6e58d },
    rifle: { nome: "MUNIÇÃO DE RIFLE", cor: 0x54a0ff },
    cartucho: { nome: "CARTUCHOS", cor: 0xff9f43 },
    pesada: { nome: "MUNIÇÃO PESADA", cor: 0xff4757 }
});

/*
 * PASSOS 33 a 45 — Cada arma carrega dano, cadência, pente e recarga.
 * capacidadePente: máximo de tiros antes da recarga.
 * tempoRecarga: duração da recarga em milissegundos.
 */
const ARMAS = Object.freeze({
    pistola: {
        nome: "PISTOLA",
        tipoDisparo: "SEMIAUTOMÁTICA",
        automatico: false,
        tipoMunicao: "leve",
        dano: 25,
        intervaloTiro: 350,
        velocidadeBala: 720,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0xffe66d,
        cadencia: "BAIXA",
        capacidadePente: 12,
        tempoRecarga: 1000
    },
    rifle: {
        nome: "RIFLE",
        tipoDisparo: "AUTOMÁTICO",
        automatico: true,
        tipoMunicao: "rifle",
        dano: 30,
        intervaloTiro: 140,
        velocidadeBala: 900,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0x54a0ff,
        cadencia: "MÉDIA",
        capacidadePente: 30,
        tempoRecarga: 1400
    },
    smg: {
        nome: "SMG",
        tipoDisparo: "AUTOMÁTICA",
        automatico: true,
        tipoMunicao: "leve",
        dano: 17,
        intervaloTiro: 80,
        velocidadeBala: 780,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0xa29bfe,
        cadencia: "ALTA",
        capacidadePente: 32,
        tempoRecarga: 1200
    },
    escopeta: {
        nome: "ESCOPETA",
        tipoDisparo: "SEMIAUTOMÁTICA",
        automatico: false,
        tipoMunicao: "cartucho",
        dano: 12,
        intervaloTiro: 700,
        velocidadeBala: 580,
        projeteisPorTiro: 6,
        dispersaoGraus: 22,
        corProjetil: 0xff9f43,
        cadencia: "BAIXA",
        capacidadePente: 6,
        tempoRecarga: 1800
    },
    sniper: {
        nome: "SNIPER",
        tipoDisparo: "SEMIAUTOMÁTICA",
        automatico: false,
        tipoMunicao: "pesada",
        dano: 100,
        intervaloTiro: 950,
        velocidadeBala: 1200,
        projeteisPorTiro: 1,
        dispersaoGraus: 0,
        corProjetil: 0xff4757,
        cadencia: "MUITO BAIXA",
        capacidadePente: 5,
        tempoRecarga: 2200
    }
});

/*
 * PASSOS 48 a 50 — Itens que aparecem no mapa.
 * Armas entram em um slot vazio; munição vai para a reserva do seu tipo.
 */
const LOOT_INICIAL = Object.freeze([
    { tipo: "arma", armaId: "rifle", x: 1200, y: 500 },
    { tipo: "arma", armaId: "smg", x: 1660, y: 700 },
    { tipo: "arma", armaId: "escopeta", x: 1770, y: 1160 },
    { tipo: "arma", armaId: "sniper", x: 2500, y: 1540 },
    { tipo: "municao", tipoMunicao: "leve", quantidade: 24, x: 760, y: 590 },
    { tipo: "municao", tipoMunicao: "rifle", quantidade: 60, x: 1260, y: 570 },
    { tipo: "municao", tipoMunicao: "leve", quantidade: 48, x: 1710, y: 770 },
    { tipo: "municao", tipoMunicao: "cartucho", quantidade: 18, x: 1820, y: 1230 },
    { tipo: "municao", tipoMunicao: "pesada", quantidade: 10, x: 2560, y: 1600 }
]);

const CONFIGURACAO_PARTIDA = {
    larguraMapa: 3000,
    alturaMapa: 2000,
    vidaInicialJogador: 100,
    intervaloDanoJogador: 1000,
    velocidadeJogador: 250,
    velocidadeCorrida: 400,
    distanciaColeta: 68,
    jogadoresIniciais: INIMIGOS_INICIAIS.length + 1
};

let jogador;
let teclas;
let balas;
let obstaculos;
let inimigos;
let loots;
let ultimaDirecao = "baixo";
let ultimoTiro = Number.NEGATIVE_INFINITY;
let ultimoDanoJogador = Number.NEGATIVE_INFINITY;
let vidaJogador = CONFIGURACAO_PARTIDA.vidaInicialJogador;
let eliminacoes = 0;
let jogadoresVivos = CONFIGURACAO_PARTIDA.jogadoresIniciais;
let inventarioArmas;
let recargaAtual = null;
let lootProximo = null;
let jogoEncerrado = false;
let temporizadorFeedback;

const interfacePartida = {
    vida: document.getElementById("vida-atual"),
    barraVida: document.getElementById("barra-vida"),
    cartaoVida: document.querySelector(".hud__item--vida"),
    jogadoresVivos: document.getElementById("jogadores-vivos"),
    eliminacoes: document.getElementById("eliminacoes-atual"),
    eliminacoesFinais: document.getElementById("eliminacoes-finais"),
    armaAtual: document.getElementById("arma-atual"),
    estatisticasArma: document.getElementById("estatisticas-arma"),
    municaoPente: document.getElementById("municao-pente"),
    municaoPenteMaximo: document.getElementById("municao-pente-maximo"),
    municaoReserva: document.getElementById("municao-reserva"),
    statusRecarga: document.getElementById("status-recarga"),
    progressoRecarga: document.getElementById("progresso-recarga"),
    slotsArmas: [...document.querySelectorAll("[data-slot]")],
    avisoLoot: document.getElementById("aviso-loot"),
    lootNome: document.getElementById("loot-nome"),
    lootDescricao: document.getElementById("loot-descricao"),
    feedback: document.getElementById("feedback-partida"),
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
    criarLootInicial(this);
    criarInimigosIniciais(this);
    jogadoresVivos = inimigos.countActive(true) + 1;
    atualizarHUD();
    configurarColisoes(this);
    criarAnimacoes(this);
    configurarControles(this);

    this.cameras.main.startFollow(jogador);
}

function criarInventarioInicial() {
    const pentes = {};

    Object.keys(ARMAS).forEach((armaId) => {
        pentes[armaId] = 0;
    });

    pentes.pistola = ARMAS.pistola.capacidadePente;

    return {
        slots: ["pistola", null, null, null, null],
        indiceAtivo: 0,
        pentes,
        reserva: {
            leve: 36,
            rifle: 0,
            cartucho: 0,
            pesada: 0
        }
    };
}

function resetarEstadoDaPartida() {
    vidaJogador = CONFIGURACAO_PARTIDA.vidaInicialJogador;
    eliminacoes = 0;
    jogadoresVivos = CONFIGURACAO_PARTIDA.jogadoresIniciais;
    ultimoDanoJogador = Number.NEGATIVE_INFINITY;
    ultimoTiro = Number.NEGATIVE_INFINITY;
    inventarioArmas = criarInventarioInicial();
    recargaAtual = null;
    lootProximo = null;
    jogoEncerrado = false;

    esconderTelaDerrota();
    esconderAvisoLoot();
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

function criarLootInicial(cena) {
    loots = cena.add.group();

    LOOT_INICIAL.forEach((dadosLoot) => {
        if (dadosLoot.tipo === "arma") {
            criarLootArma(cena, dadosLoot);
            return;
        }

        criarLootMunicao(cena, dadosLoot);
    });
}

function criarLootArma(cena, { armaId, x, y }) {
    const arma = ARMAS[armaId];
    const item = cena.add.rectangle(x, y, 38, 18, arma.corProjetil);
    item.setStrokeStyle(2, 0xffffff, 0.78);
    item.setData("tipoLoot", "arma");
    item.setData("armaId", armaId);
    item.setData("nome", arma.nome);
    item.setData("descricao", "ARMA");
    item.setData("rotulo", criarRotuloLoot(cena, x, y, arma.nome, arma.corProjetil));
    loots.add(item);
}

function criarLootMunicao(cena, { tipoMunicao, quantidade, x, y }) {
    const municao = TIPOS_MUNICAO[tipoMunicao];
    const item = cena.add.circle(x, y, 11, municao.cor);
    item.setStrokeStyle(2, 0xffffff, 0.72);
    item.setData("tipoLoot", "municao");
    item.setData("tipoMunicao", tipoMunicao);
    item.setData("quantidade", quantidade);
    item.setData("nome", `+${quantidade} ${municao.nome}`);
    item.setData("descricao", "MUNIÇÃO");
    item.setData("rotulo", criarRotuloLoot(cena, x, y, `+${quantidade}`, municao.cor));
    loots.add(item);
}

function criarRotuloLoot(cena, x, y, texto, cor) {
    return cena.add.text(x, y - 25, texto, {
        color: "#ffffff",
        fontFamily: "Arial",
        fontSize: "10px",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3
    }).setOrigin(0.5).setTint(cor);
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
    cena.physics.add.overlap(jogador, inimigos, (_jogador, inimigo) => causarDanoNoJogador(cena, inimigo));
    cena.physics.add.collider(inimigos, obstaculos);
    cena.physics.add.overlap(balas, inimigos, causarDanoNoInimigo);

    cena.physics.add.collider(balas, obstaculos, (objeto1, objeto2) => {
        const bala = balas.contains(objeto1) ? objeto1 : objeto2;

        if (bala && bala.active) {
            bala.destroy();
        }
    });

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
        recarregar: "R",
        interagir: "E",
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
    atualizarRecarga(this);
    atualizarLoot();
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

/* PASSOS 46 e 47 — Teclas 1–5 selecionam apenas slots ocupados. */
function atualizarTrocaDeArma() {
    const selecoes = [teclas.arma1, teclas.arma2, teclas.arma3, teclas.arma4, teclas.arma5];

    selecoes.forEach((tecla, indice) => {
        if (Phaser.Input.Keyboard.JustDown(tecla)) {
            selecionarSlotDeArma(indice);
        }
    });
}

function selecionarSlotDeArma(indice) {
    const armaId = inventarioArmas.slots[indice];

    if (!armaId) {
        mostrarFeedback(`SLOT ${indice + 1} VAZIO — PEGUE UMA ARMA`);
        return;
    }

    if (indice === inventarioArmas.indiceAtivo) {
        return;
    }

    cancelarRecarga();
    inventarioArmas.indiceAtivo = indice;
    ultimoTiro = Number.NEGATIVE_INFINITY;
    atualizarHUD();
    mostrarFeedback(`${ARMAS[armaId].nome} EQUIPADA`);
}

function obterArmaAtualId() {
    return inventarioArmas.slots[inventarioArmas.indiceAtivo];
}

/* PASSOS 44 e 45 — R inicia e conclui a recarga após o tempo da arma. */
function atualizarRecarga(cena) {
    if (recargaAtual) {
        atualizarInterfaceRecarga(cena.time.now);

        if (cena.time.now >= recargaAtual.terminaEm) {
            concluirRecarga();
        }

        return;
    }

    if (Phaser.Input.Keyboard.JustDown(teclas.recarregar)) {
        iniciarRecarga(cena);
    }
}

function iniciarRecarga(cena) {
    const armaId = obterArmaAtualId();

    if (!armaId) {
        return;
    }

    const arma = ARMAS[armaId];
    const penteAtual = inventarioArmas.pentes[armaId];
    const reservaAtual = inventarioArmas.reserva[arma.tipoMunicao];

    if (penteAtual >= arma.capacidadePente) {
        mostrarFeedback("PENTE JÁ ESTÁ CHEIO");
        return;
    }

    if (reservaAtual <= 0) {
        mostrarFeedback(`SEM ${TIPOS_MUNICAO[arma.tipoMunicao].nome}`);
        return;
    }

    recargaAtual = {
        armaId,
        inicioEm: cena.time.now,
        terminaEm: cena.time.now + arma.tempoRecarga,
        duracao: arma.tempoRecarga
    };

    atualizarHUD();
}

function concluirRecarga() {
    const arma = ARMAS[recargaAtual.armaId];
    const espacosNoPente = arma.capacidadePente - inventarioArmas.pentes[recargaAtual.armaId];
    const quantidadeTransferida = Math.min(espacosNoPente, inventarioArmas.reserva[arma.tipoMunicao]);

    inventarioArmas.pentes[recargaAtual.armaId] += quantidadeTransferida;
    inventarioArmas.reserva[arma.tipoMunicao] -= quantidadeTransferida;
    recargaAtual = null;
    atualizarHUD();
    mostrarFeedback("RECARGA CONCLUÍDA");
}

function cancelarRecarga() {
    if (!recargaAtual) {
        return;
    }

    recargaAtual = null;
    atualizarHUD();
    mostrarFeedback("RECARGA CANCELADA");
}

function atualizarDisparo(cena) {
    if (recargaAtual) {
        return;
    }

    const armaId = obterArmaAtualId();

    if (!armaId) {
        return;
    }

    const arma = ARMAS[armaId];
    const apertouGatilho = arma.automatico
        ? teclas.atirar.isDown
        : Phaser.Input.Keyboard.JustDown(teclas.atirar);
    const podeAtirar = cena.time.now >= ultimoTiro + arma.intervaloTiro;

    if (!apertouGatilho || !podeAtirar) {
        return;
    }

    if (inventarioArmas.pentes[armaId] <= 0) {
        mostrarFeedback("PENTE VAZIO — APERTE R");
        return;
    }

    dispararArma(cena, arma);
    inventarioArmas.pentes[armaId] -= 1;
    ultimoTiro = cena.time.now;
    atualizarHUD();

    if (inventarioArmas.pentes[armaId] === 0) {
        mostrarFeedback("PENTE VAZIO — APERTE R");
    }
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

/* PASSOS 48 a 50 — Procurar o item mais próximo e coletar com E. */
function atualizarLoot() {
    const novoLootProximo = encontrarLootMaisProximo();

    if (novoLootProximo !== lootProximo) {
        lootProximo = novoLootProximo;

        if (lootProximo) {
            mostrarAvisoLoot(lootProximo);
        } else {
            esconderAvisoLoot();
        }
    }

    if (lootProximo && Phaser.Input.Keyboard.JustDown(teclas.interagir)) {
        coletarLoot(lootProximo);
    }
}

function encontrarLootMaisProximo() {
    let itemMaisProximo = null;
    let menorDistancia = CONFIGURACAO_PARTIDA.distanciaColeta;

    loots.children.iterate((item) => {
        if (!item || !item.active) {
            return;
        }

        const distancia = Phaser.Math.Distance.Between(jogador.x, jogador.y, item.x, item.y);

        if (distancia <= menorDistancia) {
            itemMaisProximo = item;
            menorDistancia = distancia;
        }
    });

    return itemMaisProximo;
}

function coletarLoot(item) {
    if (item.getData("tipoLoot") === "arma") {
        coletarArma(item);
        return;
    }

    coletarMunicao(item);
}

function coletarArma(item) {
    const armaId = item.getData("armaId");
    const arma = ARMAS[armaId];

    if (inventarioArmas.slots.includes(armaId)) {
        mostrarFeedback(`VOCÊ JÁ POSSUI ${arma.nome}`);
        return;
    }

    const slotVazio = inventarioArmas.slots.findIndex((slot) => slot === null);

    if (slotVazio === -1) {
        mostrarFeedback("SLOTS CHEIOS");
        return;
    }

    inventarioArmas.slots[slotVazio] = armaId;
    inventarioArmas.pentes[armaId] = arma.capacidadePente;
    inventarioArmas.indiceAtivo = slotVazio;
    ultimoTiro = Number.NEGATIVE_INFINITY;
    removerLoot(item);
    atualizarHUD();
    mostrarFeedback(`${arma.nome} COLETADA — PENTE CHEIO`);
}

function coletarMunicao(item) {
    const tipoMunicao = item.getData("tipoMunicao");
    const quantidade = item.getData("quantidade");

    inventarioArmas.reserva[tipoMunicao] += quantidade;
    removerLoot(item);
    atualizarHUD();
    mostrarFeedback(`+${quantidade} ${TIPOS_MUNICAO[tipoMunicao].nome}`);
}

function removerLoot(item) {
    const rotulo = item.getData("rotulo");

    if (rotulo) {
        rotulo.destroy();
    }

    item.destroy();
    lootProximo = null;
    esconderAvisoLoot();
}

function mostrarAvisoLoot(item) {
    interfacePartida.lootNome.textContent = `PEGAR ${item.getData("nome")}`;
    interfacePartida.lootDescricao.textContent = item.getData("descricao");
    interfacePartida.avisoLoot.classList.add("visivel");
    interfacePartida.avisoLoot.setAttribute("aria-hidden", "false");
}

function esconderAvisoLoot() {
    interfacePartida.avisoLoot.classList.remove("visivel");
    interfacePartida.avisoLoot.setAttribute("aria-hidden", "true");
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

    // O dano precisa ser lido antes de destruir a bala.
    const danoDaBala = Number(bala.getData("dano"));
    bala.destroy();

    if (!Number.isFinite(danoDaBala) || danoDaBala <= 0) {
        return;
    }

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
    const armaId = obterArmaAtualId();

    if (!armaId) {
        interfacePartida.armaAtual.textContent = "SEM ARMA";
        interfacePartida.estatisticasArma.textContent = "ENCONTRE UMA ARMA NO MAPA";
        interfacePartida.municaoPente.textContent = "—";
        interfacePartida.municaoPenteMaximo.textContent = "";
        interfacePartida.municaoReserva.textContent = "—";
        atualizarSlots();
        atualizarInterfaceRecarga();
        return;
    }

    const arma = ARMAS[armaId];
    const reserva = inventarioArmas.reserva[arma.tipoMunicao];

    interfacePartida.armaAtual.textContent = arma.nome;
    interfacePartida.estatisticasArma.textContent =
        `${arma.tipoDisparo} · DANO ${arma.dano} · CADÊNCIA ${arma.cadencia}`;
    interfacePartida.municaoPente.textContent = inventarioArmas.pentes[armaId];
    interfacePartida.municaoPenteMaximo.textContent = `/ ${arma.capacidadePente}`;
    interfacePartida.municaoReserva.textContent = reserva;
    atualizarSlots();
    atualizarInterfaceRecarga();
}

function atualizarSlots() {
    interfacePartida.slotsArmas.forEach((slot) => {
        const indice = Number(slot.dataset.slot);
        const armaId = inventarioArmas.slots[indice];
        const nome = slot.querySelector("[data-slot-nome]");
        const municao = slot.querySelector("[data-slot-municao]");
        const ocupado = Boolean(armaId);

        slot.classList.toggle("slot-arma--vazia", !ocupado);
        slot.classList.toggle("slot-arma--ativa", indice === inventarioArmas.indiceAtivo && ocupado);

        if (!ocupado) {
            nome.textContent = "VAZIO";
            municao.textContent = "—";
            slot.setAttribute("aria-label", `Slot ${indice + 1}: vazio`);
            return;
        }

        const arma = ARMAS[armaId];
        nome.textContent = arma.nome;
        municao.textContent = `${inventarioArmas.pentes[armaId]} / ${inventarioArmas.reserva[arma.tipoMunicao]}`;
        slot.setAttribute("aria-label", `Slot ${indice + 1}: ${arma.nome}`);
    });
}

function atualizarInterfaceRecarga(agora) {
    const recarregando = Boolean(recargaAtual);
    interfacePartida.statusRecarga.classList.toggle("visivel", recarregando);
    interfacePartida.statusRecarga.setAttribute("aria-hidden", String(!recarregando));

    if (!recarregando) {
        interfacePartida.progressoRecarga.style.width = "0%";
        return;
    }

    const tempoAtual = Number.isFinite(agora) ? agora : recargaAtual.inicioEm;
    const progresso = Phaser.Math.Clamp(
        (tempoAtual - recargaAtual.inicioEm) / recargaAtual.duracao,
        0,
        1
    );

    interfacePartida.progressoRecarga.style.width = `${progresso * 100}%`;
}

function mostrarFeedback(texto) {
    interfacePartida.feedback.textContent = texto;
    interfacePartida.feedback.classList.add("visivel");
    clearTimeout(temporizadorFeedback);

    temporizadorFeedback = window.setTimeout(() => {
        interfacePartida.feedback.classList.remove("visivel");
    }, 1600);
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

interfacePartida.botaoReiniciar.addEventListener("click", () => window.location.reload());
interfacePartida.botaoLobby.addEventListener("click", () => {
    window.location.href = "index.html";
});
