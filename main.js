const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 720,
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
let cursors;
let isCharging = false;
let jumpPower = 0;
const MAX_JUMP_POWER = 600;
let platforms;
let lastPlatformY = 700;
let direction = 0;
let background;

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
    platforms.create(240, lastPlatformY, 'platform');

    player = this.physics.add.sprite(240, 600, 'idle');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(player);
    this.cameras.main.setLerp(0.1, 0.1);
}

function update() {
    // 背景をスクロールさせる演出（オプション）
    background.tilePositionY = this.cameras.main.scrollY * 0.5;

    if (cursors.left.isDown) {
        direction = -1;
    } else if (cursors.right.isDown) {
        direction = 1;
    }

    if (cursors.space.isDown) {
        isCharging = true;
        jumpPower = Math.min(jumpPower + 20, MAX_JUMP_POWER);
        player.setTexture('charge');
    } else if (isCharging) {
        player.setVelocityY(-jumpPower);
        player.setVelocityX(direction * 200);
        isCharging = false;
        jumpPower = 0;
        player.setTexture('jump');
    }

    if (player.body.touching.down && !isCharging) {
        player.setTexture('idle');
    }

    if (player.y < lastPlatformY - 150) {
        lastPlatformY -= 150;
        const x = Phaser.Math.Between(80, 400);
        platforms.create(x, lastPlatformY, 'platform');
    }

    if (player.y > this.cameras.main.scrollY + config.height + 100) {
        this.scene.restart();
        lastPlatformY = 700;
    }
}
