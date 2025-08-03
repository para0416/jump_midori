const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#ffffff',
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
let jumpStartTime = 0;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('midori_jump', 'midori_jump.png');
    this.load.image('platform1', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('platform2', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('platform3', 'https://labs.phaser.io/assets/sprites/platform.png');
}

function create() {
    platforms = this.physics.add.staticGroup();

    const platformData = [
        { x: 240, y: 700, scaleX: 1.2 },
        { x: 320, y: 550, scaleX: 0.8 },
        { x: 160, y: 420, scaleX: 1.0 },
        { x: 280, y: 300, scaleX: 0.6 },
        { x: 200, y: 200, scaleX: 1.4 },
        { x: 260, y: 100, scaleX: 0.7 }
    ];
    platformData.forEach((p, i) => {
        let plat = platforms.create(p.x, p.y, 'platform' + ((i % 3) + 1));
        plat.setScale(p.scaleX, 1).refreshBody();
    });

    player = this.physics.add.sprite(config.width / 2, 600, 'midori_jump');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    this.cameras.main.startFollow(player);
    this.cameras.main.setLerp(0.1, 0.1);

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
        }
    });
}

function update() {
    if (player.body.touching.down && !isCharging) {
        player.setTexture('midori_jump');
    }

    if (player.y > this.cameras.main.scrollY + config.height + 100) {
        this.scene.restart();
    }
}
