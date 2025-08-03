const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let player;
let isCharging = false;
let jumpPower = 0;
const MAX_JUMP_POWER = 600;
let platforms;
let direction = 0;
let background;
let jumpStartTime = 0;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'background.png');
    this.load.image('idle', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('charge', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('jump', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
}

function create() {
    background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0).setScrollFactor(0);

    platforms = this.physics.add.staticGroup();

    const platformData = [
        { x: 240, y: 700 },
        { x: 280, y: 550 },
        { x: 200, y: 400 },
        { x: 320, y: 300 },
        { x: 160, y: 200 },
        { x: 240, y: 100 }
    ];
    platformData.forEach(p => platforms.create(p.x, p.y, 'platform'));

    player = this.physics.add.sprite(config.width / 2, 600, 'idle');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    this.cameras.main.startFollow(player);
    this.cameras.main.setLerp(0.1, 0.1);

    // タッチ操作によるジャンプチャージ
    this.input.on('pointerdown', pointer => {
        isCharging = true;
        jumpPower = 0;
        jumpStartTime = this.time.now;
        direction = (pointer.x < config.width / 2) ? -1 : 1;
    });

    this.input.on('pointerup', () => {
        if (isCharging) {
            const chargeDuration = this.time.now - jumpStartTime;
            jumpPower = Math.min(chargeDuration * 2, MAX_JUMP_POWER);
            player.setVelocityY(-jumpPower);
            player.setVelocityX(direction * 200);
            setTimeout(() => player.setVelocityX(0), 100);
            isCharging = false;
            player.setTexture('jump');
        }
    });
}

function update() {
    background.tilePositionY = this.cameras.main.scrollY * 0.5;

    if (player.body.touching.down && !isCharging) {
        player.setTexture('idle');
    }

    if (player.y > this.cameras.main.scrollY + config.height + 100) {
        this.scene.restart();
    }
}
