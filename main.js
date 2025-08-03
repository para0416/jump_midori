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

const game = new Phaser.Game(config);

function preload() {
    this.load.image('idle', 'midori_idle.png');
    this.load.image('charge', 'midori_charge.png');
    this.load.image('jump', 'midori_jump.png');
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
}

function create() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(240, 700, 'platform');

    player = this.physics.add.sprite(240, 600, 'idle');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.space.isDown) {
        isCharging = true;
        jumpPower = Math.min(jumpPower + 20, MAX_JUMP_POWER);
        player.setTexture('charge');
    } else if (isCharging) {
        player.setVelocityY(-jumpPower);
        isCharging = false;
        jumpPower = 0;
        player.setTexture('jump');
    }

    if (player.body.touching.down && !isCharging) {
        player.setTexture('idle');
    }
}
