const config = {
  type: Phaser.AUTO,
  width: 768,
  height: 512,
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

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('idle', 'assets/midori_idle.png');
  this.load.image('jump', 'assets/midori_jump.png');
  this.load.image('charge', 'assets/midori_charge.png');
}

function create() {
  // 背景
  this.add.image(384, 256, 'background').setScrollFactor(0);

  // キャラ
  player = this.physics.add.sprite(100, 400, 'idle').setScale(1).setCollideWorldBounds(true);

  // 地面の代用（透明な見えない床）
  const ground = this.physics.add.staticGroup();
  ground.create(384, 500, 'idle').setScale(10, 0.5).refreshBody().setVisible(false);
  this.physics.add.collider(player, ground);

  // 入力
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  const speed = 200;

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
    player.setFlipX(true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.setFlipX(false);
  } else {
    player.setVelocityX(0);
  }

  // ジャンプ
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
    player.setTexture('jump');
  }

  // チャージ（しゃがみ）
  if (cursors.down.isDown && player.body.touching.down) {
    player.setTexture('charge');
  }

  // 通常に戻す
  if (player.body.touching.down && !cursors.down.isDown && player.texture.key !== 'idle') {
    player.setTexture('idle');
  }
}
