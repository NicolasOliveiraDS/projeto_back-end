    let jogador;
    let teclas;
    let ultimaDirecao = "baixo";
    let balas;
    let obstaculos;
    let modoDisparo = "automatico";
    let ultimoTiro = 0;
    const intervaloTiro = 150;


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

    obstaculos = this.add.group();

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

    balas = this.physics.add.group();

    this.physics.add.collider(
        balas,
        obstaculos,
        function (objeto1,objeto2) {
            if (balas.contains(objeto1)){
                objeto1.destroy();
            }
            else if (balas.contains(objeto2)){
                objeto2.destroy();
            }
        }
    );

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
        direita: "D",
        correr: "SHIFT",
        atirar: "SPACE",
        trocarDisparo : "Q"
    });

    //Assim, quando uma bala chegar no limite do mapa, ela será destruída.
    this.physics.world.on("worldbounds", function(body) {
        if (balas.contains(body.gameObject)){
            body.gameObject.destroy();
        }
    });

    }

        function atualizarJogo() {
            const velocidade = teclas.correr.isDown ? 400 : 250;

            jogador.body.setVelocity(0);

            let movendoHorizontal = false;
            let movendoVertical = false;

            if (teclas.cima.isDown) {
                jogador.body.setVelocityY(-velocidade);
                ultimaDirecao = "cima";
                movendoVertical = true;
            }

            else if (teclas.baixo.isDown) {
                jogador.body.setVelocityY(velocidade);
                ultimaDirecao = "baixo";
                movendoVertical = true;
            }

            if (teclas.esquerda.isDown) {
                jogador.body.setVelocityX(-velocidade);
                ultimaDirecao = "esquerda";
                movendoHorizontal = true;
            }

            else if (teclas.direita.isDown) {
                jogador.body.setVelocityX(velocidade);
                ultimaDirecao = "direita";
                movendoHorizontal = true;
            }

            jogador.body.velocity.normalize().scale(velocidade);

            if (movendoHorizontal) {

                if (teclas.esquerda.isDown) {
                    jogador.anims.play("andar-esquerda", true);
                } else {
                    jogador.anims.play("andar-direita", true);
                }
            }

            else if (movendoVertical) {

                if (teclas.cima.isDown) {
                    jogador.anims.play("andar-cima", true);
                } else {
                    jogador.anims.play("andar-baixo", true);
                }
            }

            else {
                jogador.anims.stop();

                if (ultimaDirecao === "baixo") jogador.setFrame(0);
                if (ultimaDirecao === "cima") jogador.setFrame(4);
                if (ultimaDirecao === "esquerda") jogador.setFrame(8);
                if (ultimaDirecao === "direita") jogador.setFrame(12);
            }

            // Trocar modo de disparo com Q
            if (Phaser.Input.Keyboard.JustDown(teclas.trocarDisparo)) {

                 if (modoDisparo === "automatico") {
                   modoDisparo = "semiautomatico";
                   console.log("modo: SEMIAUTOMATICO");
                }else{
                    modoDisparo = "automatico";
                    console.log ("modo: AUTOMATICO");
                }
            }

             //Semiautomatico
                if (modoDisparo === "semiautomatico") {

                    if (Phaser.Input.Keyboard.JustDown(teclas.atirar)) {
                        criarDisparo(this);
                    }
                }


                // automatico
                if (modoDisparo === "automatico") {

                    if (
                        teclas.atirar.isDown &&
                        this.time.now > ultimoTiro + intervaloTiro
                    ) {
                        criarDisparo(this);
                        ultimoTiro = this.time.now;
                    }
                }

        }
    
        function criarDisparo(cena) {

            const bala = cena.add.circle(
                jogador.x,
                jogador.y,
                6,
                0xffff00
            );

            cena.physics.add.existing(bala);

            bala.body.setCollideWorldBounds(true);

            bala.body.onWorldBounds = true;

            balas.add(bala);

            const velocidadeBala = 600;

            if(ultimaDirecao === "cima"){
                bala.body.setVelocityY(-velocidadeBala);
            }
            if(ultimaDirecao === "baixo"){
                bala.body.setVelocityY(velocidadeBala);
            }
            if(ultimaDirecao === "esquerda"){
                bala.body.setVelocityX(-velocidadeBala);
            }
            if(ultimaDirecao === "direita"){
                bala.body.setVelocityX(velocidadeBala);
            }
        }