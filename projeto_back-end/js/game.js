    let jogador;
    let teclas;

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
        this.load.spritesheet(
            "jogador",
            "assets/images/jogador.png",
            {frameWidth:64,
                frameHeight:64
            }
        )
    }


    function criarJogo() {

    // Define o tamanho total do mapa
    this.cameras.main.setBounds(0, 0, 3000, 2000);

    this.physics.world.setBounds(0, 0, 3000, 2000);

    const graficos = this.add.graphics();

        graficos.lineStyle(1, 0x2f3b5f, 0.5);

        for (let x = 0; x <= 3000; x += 100) {
        graficos.lineBetween(x, 0, x, 2000);
        }

        for (let y = 0; y <= 2000; y += 100) {
        graficos.lineBetween(0, y, 3000, y);
        }

    const obstaculos = this.add.group();

    const obstaculo1 = this.add.rectangle(
    900,
    360,
    220,
    120,
    0xff3b30
    );

    const obstaculo2 = this.add.rectangle(
    1400,
    900,
    180,
    180,
    0x4c5b78
    );

    const obstaculo3 = this.add.rectangle(
    2100,
    1300,
    300,
    100,
    0x596784
    );

    this.physics.add.existing(obstaculo1, true);
    this.physics.add.existing(obstaculo2, true);
    this.physics.add.existing(obstaculo3, true);

    obstaculos.addMultiple([
    obstaculo1,
    obstaculo2,
    obstaculo3
    ]);

    // Cria o jogador no centro inicial da tela
    jogador = this.physics.add.sprite(
    640,
    360,
    "jogador",
    0
    );

    jogador.setCollideWorldBounds(true);

    this.physics.add.collider(jogador, obstaculos);

    // Faz a câmera acompanhar o jogador
    this.cameras.main.startFollow(jogador);

    //fazendo animação do jogador
    this.anims.create({
        key: "andar-baixo",
        frames: this.anims.generateFrameNumbers("jogador",{
            start: 0,
            end: 3
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: "andar-cima",
        frames: this.anims.generateFrameNumbers("jogador",{
            start: 4,
            end: 7
        }),
        frameRate: 8,
        repeat:-1
    });

    this.anims.create({
        key: "andar-esquerda",
        frames: this.anims.generateFrameNumbers("jogador",{
            start: 8,
            end: 11
        }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: "andar-direita",
        frames: this.anims.generateFrameNumbers("jogador",{
            start: 12,
            end: 15
        }),
        frameRate: 8,
        repeat: -1
    });


    // Configura as teclas
    teclas = this.input.keyboard.addKeys({
        cima: "W",
        baixo: "S",
        esquerda: "A",
        direita: "D"
    });
    }

        function atualizarJogo() {
            const velocidade = 250;

            jogador.body.setVelocity(0);

            if (teclas.cima.isDown) {
                jogador.body.setVelocityY(-velocidade);
                jogador.anims.play("andar-cima",true);
            }

            else if (teclas.baixo.isDown) {
                jogador.body.setVelocityY(velocidade);
                jogador.anims.play("andar-baixo",true)
            }

            else if (teclas.esquerda.isDown) {
                jogador.body.setVelocityX(-velocidade);
                jogador.anims.play("andar-esquerda",true)
            }

            else if (teclas.direita.isDown) {
                jogador.body.setVelocityX(velocidade);
                jogador.anims.play("andar-direita",true)
            }

            else{
                jogador.anims.stop();
            }
        }