import Phaser from 'phaser';

export default class HUD {
  constructor(scene) {
    this.scene = scene;
    const cam = scene.cameras.main;
    const zoom = cam.zoom || 1;
    const midX = cam.width / 2;
    const midY = cam.height / 2;

    // Anchor at viewport center + counter-scale so zoom has no visual effect
    this.container = scene.add.container(midX, midY)
      .setScrollFactor(0).setDepth(900).setScale(1 / zoom);

    // Helper: convert screen coords to center-relative coords
    const sx = (screenX) => screenX - midX;
    const sy = (screenY) => screenY - midY;

    // Lives display
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const heart = scene.add.image(sx(20 + i * 30), sy(20), 'heart').setScale(0.8);
      this.hearts.push(heart);
      this.container.add(heart);
    }

    // Night / level label
    this.nightLabel = scene.add.text(0, sy(12), '', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0);
    this.container.add(this.nightLabel);

    // Mission tracker (top right)
    this.missionBg = scene.add.graphics();
    this.missionBg.fillStyle(0x1a1a2e, 0.7);
    this.missionBg.fillRoundedRect(sx(cam.width - 260), sy(8), 250, 30, 6);
    this.container.add(this.missionBg);

    this.missionText = scene.add.text(sx(cam.width - 250), sy(16), '', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#FF6B6B',
    });
    this.container.add(this.missionText);

    // Timer
    this.timerText = scene.add.text(0, sy(36), '', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#AAAAAA',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 0);
    this.container.add(this.timerText);

    // Beauty product notification (centered)
    this.notifContainer = scene.add.container(0, sy(cam.height / 2 - 60)).setVisible(false);
    this.container.add(this.notifContainer);

    const notifBg = scene.add.graphics();
    notifBg.fillStyle(0x2a1a4e, 0.9);
    notifBg.fillRoundedRect(-140, -30, 280, 60, 10);
    notifBg.lineStyle(2, 0xFF69B4, 0.8);
    notifBg.strokeRoundedRect(-140, -30, 280, 60, 10);
    this.notifContainer.add(notifBg);

    this.notifText = scene.add.text(0, 0, '', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#FF69B4',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.notifContainer.add(this.notifText);

    // Stealth indicator
    this.stealthBg = scene.add.graphics();
    this.stealthBg.fillStyle(0x1a1a2e, 0.6);
    this.stealthBg.fillRoundedRect(sx(8), sy(44), 110, 22, 4);
    this.container.add(this.stealthBg);

    this.stealthLabel = scene.add.text(sx(14), sy(48), 'HIDDEN', {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: '#33FF33',
      fontStyle: 'bold',
    });
    this.container.add(this.stealthLabel);

    // Controls hint (bottom left)
    this.controlsText = scene.add.text(sx(14), sy(cam.height - 24), 'WASD / Drag: Move \u2022 SPACE / Tap: Act', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#555577',
    });
    this.container.add(this.controlsText);

    // Store helpers for updateMission
    this._sx = sx;
    this._sy = sy;
  }

  updateLives(lives) {
    for (let i = 0; i < 3; i++) {
      this.hearts[i].setTexture(i < lives ? 'heart' : 'heart_empty');
    }
  }

  updateNight(nightNum, nightName) {
    this.nightLabel.setText(`Night ${nightNum}: ${nightName}`);
  }

  updateMission(text) {
    this.missionText.setText(text);
    const cam = this.scene.cameras.main;
    const w = Math.max(250, this.missionText.width + 20);
    this.missionBg.clear();
    this.missionBg.fillStyle(0x1a1a2e, 0.7);
    this.missionBg.fillRoundedRect(this._sx(cam.width - w - 10), this._sy(8), w, 30, 6);
    this.missionText.setX(this._sx(cam.width - w));
  }

  updateTimer(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const timeStr = `${m}:${s.toString().padStart(2, '0')}`;
    this.timerText.setText(timeStr);
    if (seconds < 30) {
      this.timerText.setColor('#FF4444');
    } else if (seconds < 60) {
      this.timerText.setColor('#FFAA44');
    } else {
      this.timerText.setColor('#AAAAAA');
    }
  }

  updateStealth(isHidden, isSpotted) {
    if (isSpotted) {
      this.stealthLabel.setText('SPOTTED!');
      this.stealthLabel.setColor('#FF3333');
    } else if (isHidden) {
      this.stealthLabel.setText('HIDDEN');
      this.stealthLabel.setColor('#33FF33');
    } else {
      this.stealthLabel.setText('EXPOSED');
      this.stealthLabel.setColor('#FFAA33');
    }
  }

  showNotification(text, duration = 2000) {
    this.notifText.setText(text);
    this.notifContainer.setVisible(true);
    this.notifContainer.setAlpha(0);
    this.notifContainer.setScale(0.5);

    this.scene.tweens.add({
      targets: this.notifContainer,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(duration, () => {
          this.scene.tweens.add({
            targets: this.notifContainer,
            alpha: 0,
            scale: 0.8,
            duration: 300,
            onComplete: () => this.notifContainer.setVisible(false),
          });
        });
      },
    });
  }

  destroy() {
    this.container.destroy();
  }
}
