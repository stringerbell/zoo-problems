import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Starry night background
    this.add.graphics()
      .fillStyle(0x0a0a1e)
      .fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height * 0.6;
      const size = Math.random() * 2 + 1;
      const star = this.add.graphics()
        .fillStyle(0xFFFFFF, Math.random() * 0.5 + 0.5)
        .fillCircle(sx, sy, size);
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: 1000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Moon
    this.add.graphics()
      .fillStyle(0xFFF8DC)
      .fillCircle(width - 100, 80, 40)
      .fillStyle(0x0a0a1e)
      .fillCircle(width - 85, 70, 35);

    // Ground
    this.add.graphics()
      .fillStyle(0x2d5a1e)
      .fillRect(0, height * 0.65, width, height * 0.35)
      .fillStyle(0x3a7a28)
      .fillRect(0, height * 0.65, width, 4);

    // Fence in foreground
    for (let x = 0; x < width; x += 40) {
      this.add.graphics()
        .fillStyle(0x4a3728)
        .fillRect(x + 5, height * 0.6, 6, 60)
        .fillRect(x + 25, height * 0.6, 6, 60)
        .fillRect(x, height * 0.65, 40, 4)
        .fillRect(x, height * 0.75, 40, 4);
    }

    // Title
    const titleShadow = this.add.text(width / 2 + 3, 83, 'ZOO PROBLEMS', {
      fontSize: '52px',
      fontFamily: 'monospace',
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const title = this.add.text(width / 2, 80, 'ZOO PROBLEMS', {
      fontSize: '52px',
      fontFamily: 'monospace',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [title, titleShadow],
      y: '+=8',
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Subtitle
    this.add.text(width / 2, 130, 'A Giraffe\'s Guide to Nighttime Mischief', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#AABBCC',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Animated giraffe
    const giraffe = this.add.image(width / 2, height * 0.55, 'giraffe').setScale(3);
    this.tweens.add({
      targets: giraffe,
      y: '+=6',
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // Play button
    const btnW = 220, btnH = 50;
    const btnX = width / 2 - btnW / 2;
    const btnY = height - 120;

    const btnBg = this.add.graphics();
    this.drawButton(btnBg, btnX, btnY, btnW, btnH, false);

    const btnText = this.add.text(width / 2, btnY + btnH / 2, 'START MISCHIEF', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const btnZone = this.add.zone(btnX, btnY, btnW, btnH).setOrigin(0).setInteractive({ useHandCursor: true });

    btnZone.on('pointerover', () => {
      this.drawButton(btnBg, btnX, btnY, btnW, btnH, true);
      btnText.setColor('#FFD700');
    });
    btnZone.on('pointerout', () => {
      this.drawButton(btnBg, btnX, btnY, btnW, btnH, false);
      btnText.setColor('#FFFFFF');
    });
    btnZone.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('HabitatScene', { night: 1, lives: 3, products: [], score: 0, completedMissions: [], specialItem: null });
      });
    });

    // Also start on Enter/Space
    this.input.keyboard.on('keydown-SPACE', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('HabitatScene', { night: 1, lives: 3, products: [], score: 0, completedMissions: [], specialItem: null });
      });
    });

    // Credits
    this.add.text(width / 2, height - 30, 'WASD to move  |  SPACE to interact & hide', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#556677',
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  drawButton(graphics, x, y, w, h, hover) {
    graphics.clear();
    graphics.fillStyle(hover ? 0x4a2a6e : 0x2a1a4e, 0.9);
    graphics.fillRoundedRect(x, y, w, h, 10);
    graphics.lineStyle(2, hover ? 0xFFD700 : 0xFF69B4, 0.8);
    graphics.strokeRoundedRect(x, y, w, h, 10);
  }
}
