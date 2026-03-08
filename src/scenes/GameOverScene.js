import Phaser from 'phaser';
import { BEAUTY_PRODUCTS, SPECIAL_ITEMS } from '../data/gameData.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.gameState = data;
  }

  create() {
    const { width, height } = this.cameras.main;
    const state = this.gameState;
    const won = state.won || false;

    // Background
    this.add.graphics()
      .fillStyle(won ? 0x0a1a0e : 0x1a0a0e)
      .fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const star = this.add.graphics()
        .fillStyle(0xFFFFFF, Math.random() * 0.5 + 0.3)
        .fillCircle(sx, sy, Math.random() * 1.5 + 0.5);
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: 800 + Math.random() * 1500,
        yoyo: true,
        repeat: -1,
      });
    }

    // Title
    if (won) {
      this.add.text(width / 2, 50, 'YOU DID IT!', {
        fontSize: '42px',
        fontFamily: 'monospace',
        color: '#33FF33',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      this.add.text(width / 2, 90, 'The zoo will never be the same!', {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#88CC88',
        fontStyle: 'italic',
      }).setOrigin(0.5);
    } else {
      this.add.text(width / 2, 50, 'BUSTED!', {
        fontSize: '42px',
        fontFamily: 'monospace',
        color: '#FF4444',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      this.add.text(width / 2, 90, 'Back to the habitat for you...', {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#CC8888',
        fontStyle: 'italic',
      }).setOrigin(0.5);
    }

    // Score
    this.add.text(width / 2, 130, `Final Score: ${state.score}`, {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 158, `Nights survived: ${state.night}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#AAAAAA',
    }).setOrigin(0.5);

    // Beauty products collected
    if (state.products.length > 0) {
      this.add.text(width / 2, 195, 'Beauty Collection:', {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#FF69B4',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      const startX = width / 2 - (state.products.length * 35) / 2;
      for (let i = 0; i < state.products.length; i++) {
        const product = BEAUTY_PRODUCTS.find(p => p.id === state.products[i]);
        if (product) {
          this.add.text(startX + i * 35, 220, product.emoji, {
            fontSize: '24px',
          }).setOrigin(0.5);

          this.add.text(startX + i * 35, 242, product.name.split(' ')[0], {
            fontSize: '8px',
            fontFamily: 'monospace',
            color: '#CC88AA',
          }).setOrigin(0.5);
        }
      }
    }

    // Special item display
    if (state.specialItem) {
      const item = SPECIAL_ITEMS.find(i => i.id === state.specialItem);
      if (item) {
        const sy = state.products.length > 0 ? 270 : 195;
        this.add.text(width / 2, sy, `Special: ${item.emoji} ${item.name}`, {
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#FFD700',
          fontStyle: 'bold',
        }).setOrigin(0.5);
      }
    }

    // Giraffe with all collected products
    const giraffeY = (state.products.length > 0 || state.specialItem) ? 330 : 270;
    const giraffe = this.add.image(width / 2, giraffeY, 'giraffe').setScale(3);
    for (const productId of state.products) {
      this.add.image(width / 2, giraffeY, 'beauty_' + productId).setScale(3);
    }
    if (state.specialItem) {
      this.add.image(width / 2, giraffeY, 'special_' + state.specialItem).setScale(3);
    }
    this.tweens.add({
      targets: giraffe,
      y: '+=5',
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Sparkles around giraffe if won
    if (won) {
      for (let i = 0; i < 12; i++) {
        const sparkle = this.add.image(
          width / 2 + Math.cos(i * Math.PI / 6) * 60,
          giraffeY + Math.sin(i * Math.PI / 6) * 40,
          'sparkle'
        ).setScale(0.8);
        this.tweens.add({
          targets: sparkle,
          alpha: 0.3,
          scale: 1.2,
          duration: 500 + i * 100,
          yoyo: true,
          repeat: -1,
        });
      }
    }

    // Retry button
    const btnY = height - 80;
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x2a1a4e, 0.9);
    btnBg.fillRoundedRect(width / 2 - 100, btnY - 20, 200, 40, 10);
    btnBg.lineStyle(2, 0xFF69B4, 0.8);
    btnBg.strokeRoundedRect(width / 2 - 100, btnY - 20, 200, 40, 10);

    const btnText = this.add.text(width / 2, btnY, won ? 'PLAY AGAIN' : 'TRY AGAIN', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const zone = this.add.zone(width / 2 - 100, btnY - 20, 200, 40)
      .setOrigin(0).setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x4a2a6e, 0.9);
      btnBg.fillRoundedRect(width / 2 - 100, btnY - 20, 200, 40, 10);
      btnBg.lineStyle(2, 0xFFD700, 0.9);
      btnBg.strokeRoundedRect(width / 2 - 100, btnY - 20, 200, 40, 10);
      btnText.setColor('#FFD700');
    });
    zone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x2a1a4e, 0.9);
      btnBg.fillRoundedRect(width / 2 - 100, btnY - 20, 200, 40, 10);
      btnBg.lineStyle(2, 0xFF69B4, 0.8);
      btnBg.strokeRoundedRect(width / 2 - 100, btnY - 20, 200, 40, 10);
      btnText.setColor('#FFFFFF');
    });

    const restart = () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('MenuScene');
      });
    };

    zone.on('pointerdown', restart);
    this.input.keyboard.on('keydown-SPACE', restart);
    this.input.keyboard.on('keydown-ENTER', restart);

    // Hint text
    this.add.text(width / 2, height - 30, 'Press SPACE or ENTER to continue', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#555577',
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(800, 0, 0, 0);
  }
}
