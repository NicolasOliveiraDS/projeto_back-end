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
 * PASSO 52 — Raridades das armas encontradas no mapa.
 * O multiplicador só é aplicado ao dano do projétil depois de a arma ser coletada.
 * As probabilidades são controladas por sortearRaridade(), logo é simples balanceá-las.
 */
const RARIDADES = Object.freeze({
    comum: { nome: "COMUM", cor: 0xb2bec3, multiplicadorDano: 1 },
    incomum: { nome: "INCOMUM", cor: 0x2ecc71, multiplicadorDano: 1.08 },
    raro: { nome: "RARO", cor: 0x3498db, multiplicadorDano: 1.16 },
    epico: { nome: "ÉPICO", cor: 0x9b59b6, multiplicadorDano: 1.25 },
    lendario: { nome: "LENDÁRIO", cor: 0xf1c40f, multiplicadorDano: 1.35 }
});

/*
 * PASSOS 54 a 57 — Itens guardados na mochila e usados pelo teclado.
 * limite define quantas unidades cabem na mochila durante a partida.
 */
const ITENS_CONSUMIVEIS = Object.freeze({
    kitMedico: {
        nome: "KIT MÉDICO",
        descricao: "+45 VIDA",
        tecla: "Q",
        tipo: "cura",
        quantidade: 45,
        limite: 3,
        cor: 0x2ed573
    },
    escudoPequeno: {
        nome: "ESCUDO PEQUENO",
        descricao: "+25 ESCUDO",
        tecla: "F",
        tipo: "escudo",
        quantidade: 25,
        limite: 3,
        cor: 0x54a0ff
    },
    escudoGrande: {
        nome: "ESCUDO GRANDE",
        descricao: "+50 ESCUDO",
        tecla: "G",
        tipo: "escudo",
        quantidade: 50,
        limite: 2,
        cor: 0x5f27cd
    }
});

/*
 * PASSOS 48 a 57 — Itens que aparecem no mapa.
 * Armas entram em um slot vazio; munição e consumíveis vão para a mochila.
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
    { tipo: "municao", tipoMunicao: "pesada", quantidade: 10, x: 2560, y: 1600 },
    { tipo: "consumivel", itemId: "kitMedico", x: 710, y: 570 },
    { tipo: "consumivel", itemId: "escudoPequeno", x: 1070, y: 650 },
    { tipo: "consumivel", itemId: "escudoGrande", x: 1540, y: 720 },
    { tipo: "consumivel", itemId: "kitMedico", x: 1960, y: 1260 },
    { tipo: "consumivel", itemId: "escudoPequeno", x: 2420, y: 1460 }
]);

/*
 * PASSO 65 — Regiões visuais da arena. Elas cobrem o mapa inteiro e podem receber
 * novos elementos sem alterar a lógica de colisão.
 */
const REGIOES_MAPA = Object.freeze([
    { nome: "BOSQUE NORTE", x: 0, y: 0, largura: 1050, altura: 950, cor: 0x355c45, corDetalhe: 0x467757 },
    { nome: "POSTO AVANÇADO", x: 1050, y: 0, largura: 950, altura: 950, cor: 0x465064, corDetalhe: 0x5a677d },
    { nome: "PEDREIRA", x: 2000, y: 0, largura: 1000, altura: 950, cor: 0x716554, corDetalhe: 0x8c7d66 },
    { nome: "VALE VERDE", x: 0, y: 950, largura: 1500, altura: 1050, cor: 0x2f684e, corDetalhe: 0x438061 },
    { nome: "DISTRITO SUL", x: 1500, y: 950, largura: 1500, altura: 1050, cor: 0x3f4a59, corDetalhe: 0x586577 }
]);

/*
 * PASSOS 58 a 64 — Elementos desenhados de forma procedural.
 * Todos os elementos listados aqui criam também uma área de colisão invisível.
 */
const ELEMENTOS_MAPA = Object.freeze([
    { tipo: "casa", nome: "CASA DO CAMPO", x: 900, y: 360, largura: 220, altura: 120 },
    { tipo: "casa", nome: "CABANA", x: 470, y: 1120, largura: 180, altura: 130 },
    { tipo: "casa", nome: "ALOJAMENTO", x: 1710, y: 300, largura: 190, altura: 130 },
    { tipo: "muro", x: 1220, y: 780, largura: 290, altura: 32 },
    { tipo: "muro", x: 1380, y: 1010, largura: 32, altura: 270 },
    { tipo: "muro", x: 1880, y: 650, largura: 230, altura: 32 },
    { tipo: "construcao", nome: "OFICINA", x: 2100, y: 1300, largura: 300, altura: 100 },
    { tipo: "caixa", x: 680, y: 720, tamanho: 46 },
    { tipo: "caixa", x: 735, y: 720, tamanho: 46 },
    { tipo: "caixa", x: 680, y: 775, tamanho: 46 },
    { tipo: "caixa", x: 2450, y: 1080, tamanho: 48 },
    { tipo: "caixa", x: 2510, y: 1080, tamanho: 48 },
    { tipo: "pedra", x: 2250, y: 250, tamanho: 46 },
    { tipo: "pedra", x: 2440, y: 430, tamanho: 58 },
    { tipo: "pedra", x: 2700, y: 670, tamanho: 40 },
    { tipo: "pedra", x: 2520, y: 1710, tamanho: 54 },
    { tipo: "pedra", x: 2800, y: 1530, tamanho: 42 },
    { tipo: "arvore", x: 180, y: 210, tamanho: 38 },
    { tipo: "arvore", x: 320, y: 500, tamanho: 42 },
    { tipo: "arvore", x: 550, y: 190, tamanho: 36 },
    { tipo: "arvore", x: 760, y: 810, tamanho: 42 },
    { tipo: "arvore", x: 240, y: 1500, tamanho: 44 },
    { tipo: "arvore", x: 680, y: 1610, tamanho: 36 },
    { tipo: "arvore", x: 980, y: 1420, tamanho: 46 },
    { tipo: "arvore", x: 1180, y: 1720, tamanho: 38 }
]);

/*
 * PASSOS 66 a 68 — Regras da zona de segurança.
 * A zona começa grande, aguarda alguns segundos e reduz de maneira contínua.
 */
const CONFIGURACAO_ZONA = Object.freeze({
    centroX: 1500,
    centroY: 1000,
    raioInicial: 1300,
    raioFinal: 310,
    atrasoInicial: 15000,
    duracaoReducao: 150000,
    danoPorSegundo: 8,
    intervaloDano: 1000,
    cor: 0x9b59ff
});

const CONFIGURACAO_PARTIDA = {
    larguraMapa: 3000,
    alturaMapa: 2000,
    vidaInicialJogador: 100,
    escudoMaximoJogador: 100,
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
let escudoJogador = 0;
let eliminacoes = 0;
let jogadoresVivos = CONFIGURACAO_PARTIDA.jogadoresIniciais;
let inventarioArmas;
let recargaAtual = null;
let lootProximo = null;
let jogoEncerrado = false;
let temporizadorFeedback;
let zonaGrafico;
let estadoZona;
let ultimoDanoZona = Number.NEGATIVE_INFINITY;
let inicioPartidaEm = 0;
let tempoSobrevividoMs = 0;
let danoCausado = 0;
let cenaDaPartida;

const interfacePartida = {
    vida: document.getElementById("vida-atual"),
    barraVida: document.getElementById("barra-vida"),
    cartaoVida: document.querySelector(".hud__item--vida"),
    escudo: document.getElementById("escudo-atual"),
    barraEscudo: document.getElementById("barra-escudo"),
    zona: document.getElementById("zona-atual"),
    jogadoresVivos: document.getElementById("jogadores-vivos"),
    eliminacoes: document.getElementById("eliminacoes-atual"),
    eliminacoesFinais: document.getElementById("eliminacoes-finais"),
    tempoFinalDerrota: document.getElementById("tempo-final-derrota"),
    danoFinalDerrota: document.getElementById("dano-final-derrota"),
    armaAtual: document.getElementById("arma-atual"),
    estatisticasArma: document.getElementById("estatisticas-arma"),
    municaoPente: document.getElementById("municao-pente"),
    municaoPenteMaximo: document.getElementById("municao-pente-maximo"),
    municaoReserva: document.getElementById("municao-reserva"),
    statusRecarga: document.getElementById("status-recarga"),
    progressoRecarga: document.getElementById("progresso-recarga"),
    slotsArmas: [...document.querySelectorAll("[data-slot]")],
    consumiveis: {
        kitMedico: document.getElementById("quantidade-kit-medico"),
        escudoPequeno: document.getElementById("quantidade-escudo-pequeno"),
        escudoGrande: document.getElementById("quantidade-escudo-grande")
    },
    avisoLoot: document.getElementById("aviso-loot"),
    lootNome: document.getElementById("loot-nome"),
    lootDescricao: document.getElementById("loot-descricao"),
    feedback: document.getElementById("feedback-partida"),
    telaDerrota: document.getElementById("tela-derrota"),
    botaoReiniciar: document.getElementById("botao-reiniciar"),
    botaoLobby: document.getElementById("botao-lobby"),
    telaVitoria: document.getElementById("tela-vitoria"),
    tempoFinalVitoria: document.getElementById("tempo-final-vitoria"),
    danoFinalVitoria: document.getElementById("dano-final-vitoria"),
    eliminacoesVitoria: document.getElementById("eliminacoes-vitoria"),
    botaoReiniciarVitoria: document.getElementById("botao-reiniciar-vitoria"),
    botaoLobbyVitoria: document.getElementById("botao-lobby-vitoria")
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

/*
 * Sorteio de raridade: 50% comum, 25% incomum, 15% raro, 8% épico e 2% lendário.
 * O retorno é a chave de RARIDADES, para evitar valores soltos pelo restante do jogo.
 */
function sortearRaridade() {
    const sorteio = Math.random() * 100;

    if (sorteio < 50) return "comum";
    if (sorteio < 75) return "incomum";
    if (sorteio < 90) return "raro";
    if (sorteio < 98) return "epico";

    return "lendario";
}

const jogo = new Phaser.Game(config);

function carregarArquivos() {
    this.load.spritesheet("jogador", "assets/images/jogador.png", {
        frameWidth: 64,
        frameHeight: 64
    });
}

function criarJogo() {
    cenaDaPartida = this;
    resetarEstadoDaPartida();
    configurarMundo(this);
    criarObstaculos(this);
    criarJogador(this);
    iniciarSistemaDaZona(this);
    criarLootInicial(this);
    criarInimigosIniciais(this);
    jogadoresVivos = inimigos.countActive(true) + 1;
    atualizarHUD();
    configurarColisoes(this);
    criarAnimacoes(this);
    configurarControles(this);
    inicioPartidaEm = this.time.now;

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
        // A raridade pertence à arma coletada, não à definição fixa em ARMAS.
        raridades: {
            pistola: "comum"
        },
        reserva: {
            leve: 36,
            rifle: 0,
            cartucho: 0,
            pesada: 0
        },
        // A mochila guarda apenas quantidades; os dados de cada item ficam em ITENS_CONSUMIVEIS.
        consumiveis: {
            kitMedico: 0,
            escudoPequeno: 0,
            escudoGrande: 0
        }
    };
}

function resetarEstadoDaPartida() {
    vidaJogador = CONFIGURACAO_PARTIDA.vidaInicialJogador;
    escudoJogador = 0;
    eliminacoes = 0;
    jogadoresVivos = CONFIGURACAO_PARTIDA.jogadoresIniciais;
    ultimoDanoJogador = Number.NEGATIVE_INFINITY;
    ultimoTiro = Number.NEGATIVE_INFINITY;
    inventarioArmas = criarInventarioInicial();
    recargaAtual = null;
    lootProximo = null;
    jogoEncerrado = false;
    ultimoDanoZona = Number.NEGATIVE_INFINITY;
    tempoSobrevividoMs = 0;
    danoCausado = 0;

    esconderTelaDerrota();
    esconderTelaVitoria();
    esconderAvisoLoot();
    atualizarHUD();
}

function configurarMundo(cena) {
    cena.cameras.main.setBounds(0, 0, CONFIGURACAO_PARTIDA.larguraMapa, CONFIGURACAO_PARTIDA.alturaMapa);
    cena.physics.world.setBounds(0, 0, CONFIGURACAO_PARTIDA.larguraMapa, CONFIGURACAO_PARTIDA.alturaMapa);

    desenharTerrenoDaArena(cena);
}

/*
 * PASSOS 58 e 65 — O terreno é desenhado antes dos objetos para ficar atrás do jogador.
 * Os detalhes seguem um padrão fixo; assim a arena mantém o mesmo visual a cada partida.
 */
function desenharTerrenoDaArena(cena) {
    const terreno = cena.add.graphics().setDepth(-20);
    const detalhes = cena.add.graphics().setDepth(-19);
    const estradas = cena.add.graphics().setDepth(-18);

    REGIOES_MAPA.forEach((regiao) => {
        terreno.fillStyle(regiao.cor, 1);
        terreno.fillRect(regiao.x, regiao.y, regiao.largura, regiao.altura);
        terreno.lineStyle(3, regiao.corDetalhe, 0.46);
        terreno.strokeRect(regiao.x, regiao.y, regiao.largura, regiao.altura);

        detalhes.fillStyle(regiao.corDetalhe, 0.2);

        for (let x = regiao.x + 45; x < regiao.x + regiao.largura; x += 90) {
            for (let y = regiao.y + 35; y < regiao.y + regiao.altura; y += 86) {
                const deslocamento = (x / 9 + y / 11) % 14;
                detalhes.fillCircle(x + deslocamento, y, 2);
            }
        }
    });

    // As estradas não bloqueiam o movimento: elas apenas unem visualmente as regiões.
    estradas.fillStyle(0x202838, 0.72);
    estradas.fillRect(0, 902, CONFIGURACAO_PARTIDA.larguraMapa, 96);
    estradas.fillRect(1452, 0, 96, CONFIGURACAO_PARTIDA.alturaMapa);
    estradas.lineStyle(3, 0x8d98aa, 0.5);
    estradas.lineBetween(0, 950, CONFIGURACAO_PARTIDA.larguraMapa, 950);
    estradas.lineBetween(1500, 0, 1500, CONFIGURACAO_PARTIDA.alturaMapa);

    REGIOES_MAPA.forEach((regiao) => criarTituloDaRegiao(cena, regiao));
}

function criarTituloDaRegiao(cena, regiao) {
    cena.add.text(regiao.x + regiao.largura / 2, regiao.y + 55, regiao.nome, {
        color: "#ffffff",
        fontFamily: "Arial",
        fontSize: "14px",
        fontStyle: "bold",
        letterSpacing: 2,
        stroke: "#101522",
        strokeThickness: 5
    }).setOrigin(0.5).setAlpha(0.42).setDepth(-17);
}

/* PASSOS 66 e 67 — Inicializa e desenha o círculo da zona atrás dos obstáculos. */
function iniciarSistemaDaZona(cena) {
    zonaGrafico = cena.add.graphics().setDepth(-10);
    estadoZona = {
        iniciaEm: cena.time.now + CONFIGURACAO_ZONA.atrasoInicial,
        raioAtual: CONFIGURACAO_ZONA.raioInicial,
        progresso: 0
    };

    atualizarZona(cena);
}

function atualizarZona(cena) {
    if (!estadoZona || !zonaGrafico) {
        return;
    }

    const agora = cena.time.now;
    const tempoDeReducao = Math.max(0, agora - estadoZona.iniciaEm);
    const progresso = Phaser.Math.Clamp(tempoDeReducao / CONFIGURACAO_ZONA.duracaoReducao, 0, 1);

    estadoZona.progresso = progresso;
    estadoZona.raioAtual = Phaser.Math.Linear(
        CONFIGURACAO_ZONA.raioInicial,
        CONFIGURACAO_ZONA.raioFinal,
        progresso
    );

    desenharZona();
    atualizarHUDDaZona(agora);

    const distanciaDoCentro = Phaser.Math.Distance.Between(
        jogador.x,
        jogador.y,
        CONFIGURACAO_ZONA.centroX,
        CONFIGURACAO_ZONA.centroY
    );
    const jogadorEstaFora = distanciaDoCentro > estadoZona.raioAtual;

    if (!jogadorEstaFora) {
        jogador.clearTint();
        return;
    }

    jogador.setTint(0xd7b4ff);

    if (agora < ultimoDanoZona + CONFIGURACAO_ZONA.intervaloDano) {
        return;
    }

    // A zona fica até 75% mais forte até chegar ao raio final.
    const danoDaZona = Math.ceil(CONFIGURACAO_ZONA.danoPorSegundo * (1 + progresso * 0.75));
    ultimoDanoZona = agora;
    aplicarDanoNoJogador(cena, danoDaZona);

    if (!jogoEncerrado) {
        mostrarFeedback(`FORA DA ZONA — ${danoDaZona} DE DANO`);
    }
}

function desenharZona() {
    zonaGrafico.clear();
    zonaGrafico.fillStyle(CONFIGURACAO_ZONA.cor, 0.075);
    zonaGrafico.fillCircle(CONFIGURACAO_ZONA.centroX, CONFIGURACAO_ZONA.centroY, estadoZona.raioAtual);
    zonaGrafico.lineStyle(8, CONFIGURACAO_ZONA.cor, 0.86);
    zonaGrafico.strokeCircle(CONFIGURACAO_ZONA.centroX, CONFIGURACAO_ZONA.centroY, estadoZona.raioAtual);
}

function atualizarHUDDaZona(agora) {
    if (agora < estadoZona.iniciaEm) {
        const segundos = Math.ceil((estadoZona.iniciaEm - agora) / 1000);
        interfacePartida.zona.textContent = `REDUZ EM ${segundos}s`;
        return;
    }

    interfacePartida.zona.textContent = `${Math.round(estadoZona.raioAtual)}m`;
}

function criarObstaculos(cena) {
    obstaculos = cena.add.group();

    ELEMENTOS_MAPA.forEach((elemento) => {
        if (elemento.tipo === "casa") {
            criarCasa(cena, elemento);
            return;
        }

        if (elemento.tipo === "muro") {
            criarMuro(cena, elemento);
            return;
        }

        if (elemento.tipo === "arvore") {
            criarArvore(cena, elemento);
            return;
        }

        if (elemento.tipo === "caixa") {
            criarCaixa(cena, elemento);
            return;
        }

        if (elemento.tipo === "pedra") {
            criarPedra(cena, elemento);
            return;
        }

        criarConstrucao(cena, elemento);
    });
}

/* Cria a área física invisível usada por jogador, inimigos e projéteis. */
function criarBloqueio(cena, x, y, largura, altura) {
    const bloqueio = cena.add.rectangle(x, y, largura, altura, 0x000000, 0);
    bloqueio.setVisible(false);
    cena.physics.add.existing(bloqueio, true);
    obstaculos.add(bloqueio);
}

function criarCasa(cena, { nome, x, y, largura, altura }) {
    const grafico = cena.add.graphics();
    const esquerda = x - largura / 2;
    const topo = y - altura / 2;

    // Sombra, paredes, telhado e porta tornam a casa reconhecível sem precisar de novos arquivos de imagem.
    grafico.fillStyle(0x17202c, 0.28);
    grafico.fillRoundedRect(esquerda + 8, topo + 10, largura, altura, 8);
    grafico.fillStyle(0xc9ae7b, 1);
    grafico.fillRoundedRect(esquerda, topo + 20, largura, altura - 20, 6);
    grafico.fillStyle(0x8b3f35, 1);
    grafico.fillTriangle(esquerda - 12, topo + 25, x, topo - 28, esquerda + largura + 12, topo + 25);
    grafico.fillStyle(0x53372a, 1);
    grafico.fillRect(x - 14, topo + altura - 38, 28, 38);
    grafico.fillStyle(0x86c5dd, 0.9);
    grafico.fillRect(esquerda + 26, topo + 43, 26, 20);
    grafico.fillRect(esquerda + largura - 52, topo + 43, 26, 20);
    grafico.lineStyle(2, 0x2d241f, 0.72);
    grafico.strokeRoundedRect(esquerda, topo + 20, largura, altura - 20, 6);

    criarRotuloEstrutura(cena, x, topo - 40, nome);
    criarBloqueio(cena, x, y + 10, largura, altura - 20);
}

function criarMuro(cena, { x, y, largura, altura }) {
    const grafico = cena.add.graphics();
    const esquerda = x - largura / 2;
    const topo = y - altura / 2;

    grafico.fillStyle(0x1e2734, 0.32);
    grafico.fillRect(esquerda + 5, topo + 5, largura, altura);
    grafico.fillStyle(0x8d98aa, 1);
    grafico.fillRoundedRect(esquerda, topo, largura, altura, 4);
    grafico.lineStyle(2, 0x4d596b, 0.9);
    grafico.strokeRoundedRect(esquerda, topo, largura, altura, 4);

    const divisao = largura >= altura ? 44 : 38;
    const limite = largura >= altura ? largura : altura;

    for (let deslocamento = divisao; deslocamento < limite; deslocamento += divisao) {
        if (largura >= altura) {
            grafico.lineBetween(esquerda + deslocamento, topo, esquerda + deslocamento, topo + altura);
        } else {
            grafico.lineBetween(esquerda, topo + deslocamento, esquerda + largura, topo + deslocamento);
        }
    }

    criarBloqueio(cena, x, y, largura, altura);
}

function criarArvore(cena, { x, y, tamanho }) {
    const grafico = cena.add.graphics();
    const raio = tamanho / 2;

    grafico.fillStyle(0x192c22, 0.3);
    grafico.fillCircle(x + 5, y + 8, raio + 4);
    grafico.fillStyle(0x5d3b25, 1);
    grafico.fillRect(x - 5, y, 10, raio + 12);
    grafico.fillStyle(0x245c3a, 1);
    grafico.fillCircle(x - raio / 2, y - raio / 3, raio * 0.72);
    grafico.fillCircle(x + raio / 2, y - raio / 3, raio * 0.72);
    grafico.fillStyle(0x367d4e, 1);
    grafico.fillCircle(x, y - raio * 0.8, raio * 0.85);

    criarBloqueio(cena, x, y + 4, tamanho, tamanho);
}

function criarCaixa(cena, { x, y, tamanho }) {
    const grafico = cena.add.graphics();
    const metade = tamanho / 2;

    grafico.fillStyle(0x20202a, 0.32);
    grafico.fillRect(x - metade + 4, y - metade + 5, tamanho, tamanho);
    grafico.fillStyle(0x9b6b3b, 1);
    grafico.fillRect(x - metade, y - metade, tamanho, tamanho);
    grafico.lineStyle(3, 0x51351f, 1);
    grafico.strokeRect(x - metade, y - metade, tamanho, tamanho);
    grafico.lineBetween(x - metade, y - metade, x + metade, y + metade);
    grafico.lineBetween(x + metade, y - metade, x - metade, y + metade);

    criarBloqueio(cena, x, y, tamanho, tamanho);
}

function criarPedra(cena, { x, y, tamanho }) {
    const grafico = cena.add.graphics();
    const raio = tamanho / 2;

    grafico.fillStyle(0x1f2730, 0.32);
    grafico.fillCircle(x + 4, y + 5, raio + 2);
    grafico.fillStyle(0x8b8f96, 1);
    grafico.fillCircle(x, y, raio);
    grafico.fillStyle(0xb2b5b9, 0.45);
    grafico.fillCircle(x - raio / 3, y - raio / 3, raio / 2.4);
    grafico.lineStyle(2, 0x535961, 0.9);
    grafico.strokeCircle(x, y, raio);

    criarBloqueio(cena, x, y, tamanho, tamanho);
}

function criarConstrucao(cena, { nome, x, y, largura, altura }) {
    const grafico = cena.add.graphics();
    const esquerda = x - largura / 2;
    const topo = y - altura / 2;

    grafico.fillStyle(0x1d2530, 0.35);
    grafico.fillRoundedRect(esquerda + 9, topo + 10, largura, altura, 6);
    grafico.fillStyle(0x596784, 1);
    grafico.fillRoundedRect(esquerda, topo, largura, altura, 5);
    grafico.fillStyle(0x303a4d, 1);
    grafico.fillRect(esquerda, topo, largura, 18);
    grafico.fillStyle(0x263243, 1);
    grafico.fillRect(x - 55, topo + 35, 110, altura - 35);
    grafico.lineStyle(2, 0x9aa8bb, 0.66);
    grafico.strokeRoundedRect(esquerda, topo, largura, altura, 5);
    grafico.lineBetween(x - 55, topo + 35, x + 55, topo + 35);

    criarRotuloEstrutura(cena, x, topo - 20, nome);
    criarBloqueio(cena, x, y, largura, altura);
}

function criarRotuloEstrutura(cena, x, y, texto) {
    cena.add.text(x, y, texto, {
        color: "#ffffff",
        fontFamily: "Arial",
        fontSize: "10px",
        fontStyle: "bold",
        stroke: "#101522",
        strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0.72);
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

        if (dadosLoot.tipo === "municao") {
            criarLootMunicao(cena, dadosLoot);
            return;
        }

        criarLootConsumivel(cena, dadosLoot);
    });
}

function criarLootArma(cena, { armaId, raridadeId = sortearRaridade(), x, y }) {
    const arma = ARMAS[armaId];
    const raridade = RARIDADES[raridadeId];
    const item = cena.add.rectangle(x, y, 38, 18, arma.corProjetil);

    // A borda e o rótulo revelam a raridade sem esconder a cor original da arma.
    item.setStrokeStyle(3, raridade.cor, 0.95);
    item.setData("tipoLoot", "arma");
    item.setData("armaId", armaId);
    item.setData("raridadeId", raridadeId);
    item.setData("nome", `${arma.nome} ${raridade.nome}`);
    item.setData("descricao", `${raridade.nome} · ARMA`);
    item.setData("rotulo", criarRotuloLoot(cena, x, y, `${arma.nome}\n${raridade.nome}`, raridade.cor));
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

/* PASSOS 54 a 57 — Desenha kits e escudos como itens que podem ser guardados na mochila. */
function criarLootConsumivel(cena, { itemId, x, y }) {
    const consumivel = ITENS_CONSUMIVEIS[itemId];

    if (!consumivel) {
        throw new Error(`Item consumível inexistente: ${itemId}`);
    }

    const item = cena.add.circle(x, y, 14, consumivel.cor);
    item.setStrokeStyle(2, 0xffffff, 0.86);
    item.setData("tipoLoot", "consumivel");
    item.setData("itemId", itemId);
    item.setData("nome", consumivel.nome);
    item.setData("descricao", consumivel.descricao);
    item.setData("rotulo", criarRotuloLoot(cena, x, y, consumivel.nome, consumivel.cor));
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
        usarKitMedico: "Q",
        usarEscudoPequeno: "F",
        usarEscudoGrande: "G",
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

    atualizarEstatisticasDaPartida(this);
    atualizarZona(this);

    if (jogoEncerrado) {
        return;
    }

    movimentarJogador();
    atualizarTrocaDeArma();
    atualizarRecarga(this);
    atualizarLoot();
    atualizarConsumiveis();
    atualizarDisparo(this);
    atualizarInimigos(this);
}

/* PASSOS 72 a 75 — Tempo e dano são acumulados para os dois resultados possíveis. */
function atualizarEstatisticasDaPartida(cena) {
    tempoSobrevividoMs = Math.max(0, cena.time.now - inicioPartidaEm);
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

/* PASSO 52 — Centraliza a leitura para armas iniciais sem raridade explícita. */
function obterRaridadeDaArma(armaId) {
    return inventarioArmas.raridades[armaId] || "comum";
}

function calcularDanoDaArma(armaId) {
    const arma = ARMAS[armaId];
    const raridade = RARIDADES[obterRaridadeDaArma(armaId)];

    return Math.round(arma.dano * raridade.multiplicadorDano);
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

    dispararArma(cena, armaId, arma);
    inventarioArmas.pentes[armaId] -= 1;
    ultimoTiro = cena.time.now;
    atualizarHUD();

    if (inventarioArmas.pentes[armaId] === 0) {
        mostrarFeedback("PENTE VAZIO — APERTE R");
    }
}

function dispararArma(cena, armaId, arma) {
    const anguloBase = anguloDaUltimaDirecao();

    for (let indice = 0; indice < arma.projeteisPorTiro; indice += 1) {
        const desvio = arma.projeteisPorTiro === 1
            ? 0
            : Phaser.Math.DegToRad(
                Phaser.Math.FloatBetween(-arma.dispersaoGraus / 2, arma.dispersaoGraus / 2)
            );

        criarProjetil(cena, armaId, arma, anguloBase + desvio);
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

function criarProjetil(cena, armaId, arma, angulo) {
    const raioProjetil = arma.projeteisPorTiro > 1 ? 4 : 6;
    const bala = cena.add.circle(jogador.x, jogador.y, raioProjetil, arma.corProjetil);
    cena.physics.add.existing(bala);
    bala.body.setCollideWorldBounds(true);
    bala.body.onWorldBounds = true;
    // O dano já sai com a raridade aplicada; inimigos só precisam ler o valor do projétil.
    bala.setData("dano", calcularDanoDaArma(armaId));
    bala.setData("arma", arma.nome);
    bala.setData("raridade", obterRaridadeDaArma(armaId));
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

    if (item.getData("tipoLoot") === "municao") {
        coletarMunicao(item);
        return;
    }

    coletarConsumivel(item);
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
    inventarioArmas.raridades[armaId] = item.getData("raridadeId") || "comum";
    inventarioArmas.indiceAtivo = slotVazio;
    ultimoTiro = Number.NEGATIVE_INFINITY;
    removerLoot(item);
    atualizarHUD();
    mostrarFeedback(`${arma.nome} ${RARIDADES[obterRaridadeDaArma(armaId)].nome} COLETADA — PENTE CHEIO`);
}

function coletarMunicao(item) {
    const tipoMunicao = item.getData("tipoMunicao");
    const quantidade = item.getData("quantidade");

    inventarioArmas.reserva[tipoMunicao] += quantidade;
    removerLoot(item);
    atualizarHUD();
    mostrarFeedback(`+${quantidade} ${TIPOS_MUNICAO[tipoMunicao].nome}`);
}

/* PASSOS 51 e 53 — Coleta respeita o limite da mochila antes de remover o item do mapa. */
function coletarConsumivel(item) {
    const itemId = item.getData("itemId");
    const consumivel = ITENS_CONSUMIVEIS[itemId];
    const quantidadeAtual = inventarioArmas.consumiveis[itemId];

    if (quantidadeAtual >= consumivel.limite) {
        mostrarFeedback(`MOCHILA CHEIA: ${consumivel.nome}`);
        return;
    }

    inventarioArmas.consumiveis[itemId] += 1;
    removerLoot(item);
    atualizarHUD();
    mostrarFeedback(`${consumivel.nome} GUARDADO — USE ${consumivel.tecla}`);
}

/* PASSOS 54 a 57 — Q cura; F e G restauram escudo, consumindo uma unidade da mochila. */
function atualizarConsumiveis() {
    const atalhos = [
        [teclas.usarKitMedico, "kitMedico"],
        [teclas.usarEscudoPequeno, "escudoPequeno"],
        [teclas.usarEscudoGrande, "escudoGrande"]
    ];

    atalhos.forEach(([tecla, itemId]) => {
        if (Phaser.Input.Keyboard.JustDown(tecla)) {
            usarConsumivel(itemId);
        }
    });
}

function usarConsumivel(itemId) {
    const consumivel = ITENS_CONSUMIVEIS[itemId];

    if (inventarioArmas.consumiveis[itemId] <= 0) {
        mostrarFeedback(`SEM ${consumivel.nome}`);
        return;
    }

    const valorAtual = consumivel.tipo === "cura" ? vidaJogador : escudoJogador;
    const valorMaximo = consumivel.tipo === "cura"
        ? CONFIGURACAO_PARTIDA.vidaInicialJogador
        : CONFIGURACAO_PARTIDA.escudoMaximoJogador;

    if (valorAtual >= valorMaximo) {
        mostrarFeedback(consumivel.tipo === "cura" ? "VIDA JÁ ESTÁ CHEIA" : "ESCUDO JÁ ESTÁ CHEIO");
        return;
    }

    const valorRestaurado = Math.min(consumivel.quantidade, valorMaximo - valorAtual);

    if (consumivel.tipo === "cura") {
        vidaJogador += valorRestaurado;
    } else {
        escudoJogador += valorRestaurado;
    }

    inventarioArmas.consumiveis[itemId] -= 1;
    atualizarHUD();
    mostrarFeedback(`+${valorRestaurado} ${consumivel.tipo === "cura" ? "VIDA" : "ESCUDO"}`);
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

    ultimoDanoJogador = cena.time.now;
    aplicarDanoNoJogador(cena, inimigo.getData("danoContato"));
}

/*
 * Centraliza dano de inimigos e da zona: escudo sempre absorve antes da vida.
 * Isso evita regras diferentes de sobrevivência para cada origem de dano.
 */
function aplicarDanoNoJogador(cena, danoRecebido) {
    if (jogoEncerrado || !Number.isFinite(danoRecebido) || danoRecebido <= 0) {
        return;
    }

    const danoAbsorvido = Math.min(escudoJogador, danoRecebido);
    escudoJogador -= danoAbsorvido;
    vidaJogador = Math.max(0, vidaJogador - (danoRecebido - danoAbsorvido));
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

    const vidaAntesDoDano = Math.max(0, Number(inimigo.getData("vida")));
    const danoAplicado = Math.min(vidaAntesDoDano, danoDaBala);
    const vidaAtual = vidaAntesDoDano - danoAplicado;
    inimigo.setData("vida", vidaAtual);
    danoCausado += danoAplicado;

    if (vidaAtual <= 0) {
        const rotulo = inimigo.getData("rotulo");

        if (rotulo) {
            rotulo.destroy();
        }

        inimigo.destroy();
        eliminacoes += 1;
        jogadoresVivos = Math.max(1, jogadoresVivos - 1);
        atualizarHUD();

        // Passos 69 a 71: com somente o jogador vivo, a partida termina em vitória.
        if (inimigos.countActive(true) === 0) {
            mostrarTelaVitoria(cenaDaPartida);
        }
    }
}

function atualizarHUD() {
    const percentualVida = (vidaJogador / CONFIGURACAO_PARTIDA.vidaInicialJogador) * 100;
    const percentualEscudo = (escudoJogador / CONFIGURACAO_PARTIDA.escudoMaximoJogador) * 100;

    interfacePartida.vida.textContent = vidaJogador;
    interfacePartida.barraVida.style.setProperty("--vida-percentual", `${percentualVida}%`);
    interfacePartida.barraVida.setAttribute("aria-valuenow", vidaJogador);
    interfacePartida.cartaoVida.classList.toggle("vida-baixa", percentualVida <= 30);
    interfacePartida.escudo.textContent = escudoJogador;
    interfacePartida.barraEscudo.style.setProperty("--escudo-percentual", `${percentualEscudo}%`);
    interfacePartida.barraEscudo.setAttribute("aria-valuenow", escudoJogador);
    interfacePartida.jogadoresVivos.textContent = jogadoresVivos;
    interfacePartida.eliminacoes.textContent = eliminacoes;
    interfacePartida.eliminacoesFinais.textContent = eliminacoes;
    atualizarHUDConsumiveis();
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
    const raridade = RARIDADES[obterRaridadeDaArma(armaId)];
    const dano = calcularDanoDaArma(armaId);

    interfacePartida.armaAtual.textContent = arma.nome;
    interfacePartida.estatisticasArma.textContent =
        `${raridade.nome} · ${arma.tipoDisparo} · DANO ${dano} · CADÊNCIA ${arma.cadencia}`;
    interfacePartida.municaoPente.textContent = inventarioArmas.pentes[armaId];
    interfacePartida.municaoPenteMaximo.textContent = `/ ${arma.capacidadePente}`;
    interfacePartida.municaoReserva.textContent = reserva;
    atualizarSlots();
    atualizarInterfaceRecarga();
}

/* PASSO 53 — Mantém a mochila visível sincronizada depois de coletar ou usar um item. */
function atualizarHUDConsumiveis() {
    Object.entries(interfacePartida.consumiveis).forEach(([itemId, elemento]) => {
        elemento.textContent = inventarioArmas.consumiveis[itemId];
    });
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
        const raridade = RARIDADES[obterRaridadeDaArma(armaId)];
        nome.textContent = arma.nome;
        municao.textContent = `${inventarioArmas.pentes[armaId]} / ${inventarioArmas.reserva[arma.tipoMunicao]}`;
        slot.style.setProperty("--cor-raridade", `#${raridade.cor.toString(16).padStart(6, "0")}`);
        slot.setAttribute("aria-label", `Slot ${indice + 1}: ${arma.nome}, ${raridade.nome}`);
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

    atualizarEstatisticasDaPartida(cena);
    jogoEncerrado = true;
    jogador.body.setVelocity(0, 0);
    jogador.anims.stop();
    cena.physics.pause();
    preencherEstatisticasFinais();

    interfacePartida.telaDerrota.classList.add("visivel");
    interfacePartida.telaDerrota.setAttribute("aria-hidden", "false");
    interfacePartida.botaoReiniciar.focus();
}

function esconderTelaDerrota() {
    interfacePartida.telaDerrota.classList.remove("visivel");
    interfacePartida.telaDerrota.setAttribute("aria-hidden", "true");
}

/* PASSOS 71 a 75 — A mesma coleta de dados alimenta derrota e vitória. */
function mostrarTelaVitoria(cena) {
    if (jogoEncerrado) {
        return;
    }

    atualizarEstatisticasDaPartida(cena);
    jogoEncerrado = true;
    jogador.body.setVelocity(0, 0);
    jogador.anims.stop();
    jogador.clearTint();
    cena.physics.pause();
    preencherEstatisticasFinais();

    interfacePartida.telaVitoria.classList.add("visivel");
    interfacePartida.telaVitoria.setAttribute("aria-hidden", "false");
    interfacePartida.botaoReiniciarVitoria.focus();
}

function esconderTelaVitoria() {
    interfacePartida.telaVitoria.classList.remove("visivel");
    interfacePartida.telaVitoria.setAttribute("aria-hidden", "true");
}

function preencherEstatisticasFinais() {
    const tempoFormatado = formatarTempo(tempoSobrevividoMs);

    interfacePartida.eliminacoesFinais.textContent = eliminacoes;
    interfacePartida.tempoFinalDerrota.textContent = tempoFormatado;
    interfacePartida.danoFinalDerrota.textContent = danoCausado;
    interfacePartida.eliminacoesVitoria.textContent = eliminacoes;
    interfacePartida.tempoFinalVitoria.textContent = tempoFormatado;
    interfacePartida.danoFinalVitoria.textContent = danoCausado;
}

function formatarTempo(tempoEmMs) {
    const totalSegundos = Math.floor(tempoEmMs / 1000);
    const minutos = Math.floor(totalSegundos / 60).toString().padStart(2, "0");
    const segundos = (totalSegundos % 60).toString().padStart(2, "0");

    return `${minutos}:${segundos}`;
}

interfacePartida.botaoReiniciar.addEventListener("click", () => window.location.reload());
interfacePartida.botaoLobby.addEventListener("click", () => {
    window.location.href = "index.html";
});
interfacePartida.botaoReiniciarVitoria.addEventListener("click", () => window.location.reload());
interfacePartida.botaoLobbyVitoria.addEventListener("click", () => {
    window.location.href = "index.html";
});
