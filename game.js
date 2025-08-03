let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let leftPressed = false;
let rightPressed = false;
let jumpPressed = false;
let jumpStarted = false;
let jumpStartTime = 0;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('stage1', 'assets/stage1.png');
    this.load.image('stage2', 'assets/stage2.png');
    this.load.image('stage3', 'assets/stage3.png');
    this.load.image('stage4', 'assets/stage4.png');
    this.load.image('stage5', 'assets/stage5.png');
}

function create() {
    this.add.image(240, 320, 'stage1');
    let ground = this.physics.add.staticGroup();
    ground.create(240, 620, 'ground');

    this.player = this.physics.add.sprite(240, 580, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();

    // タッチイベント
    document.getElementById("leftBtn").addEventListener("touchstart", () => leftPressed = true);
    document.getElementById("leftBtn").addEventListener("touchend", () => leftPressed = false);
    document.getElementById("rightBtn").addEventListener("touchstart", () => rightPressed = true);
    document.getElementById("rightBtn").addEventListener("touchend", () => rightPressed = false);
    document.getElementById("jumpBtn").addEventListener("touchstart", () => {
        if (this.player.body.touching.down && !jumpStarted) {
            jumpStartTime = this.time.now;
            jumpStarted = true;
        }
    });
    document.getElementById("jumpBtn").addEventListener("touchend", () => {
        if (jumpStarted) {
            let jumpDuration = this.time.now - jumpStartTime;
            let jumpStrength = Phaser.Math.Clamp(jumpDuration * 3, 200, 500);
            this.player.setVelocityY(-jumpStrength);
            jumpStarted = false;
        }
    });
}

function update() {
    let velocityX = 0;

    if (this.cursors.left.isDown || leftPressed) {
        velocityX = -160;
    } else if (this.cursors.right.isDown || rightPressed) {
        velocityX = 160;
    }

    this.player.setVelocityX(velocityX);

    if (this.cursors.space.isDown && this.player.body.touching.down) {
        if (!jumpStarted) {
            jumpStartTime = this.time.now;
            jumpStarted = true;
        }
    } else if (!this.cursors.space.isDown && jumpStarted) {
        let jumpDuration = this.time.now - jumpStartTime;
        let jumpStrength = Phaser.Math.Clamp(jumpDuration * 3, 200, 500);
        this.player.setVelocityY(-jumpStrength);
        jumpStarted = false;
    }
}
