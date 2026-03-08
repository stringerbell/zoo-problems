import Phaser from 'phaser';

export default class HabitatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HabitatScene' });
  }

  init(data) {
    this.gameState = {
      night: data.night || 1,
      lives: data.lives || 3,
      products: data.products || [],
      score: data.score || 0,
      completedMissions: data.completedMissions || [],
      specialItem: data.specialItem || null,
    };
  }

  create() {
    const { width, height } = this.cameras.main;
    const state = this.gameState;

    // Daytime sky gradient
    const sky = this.add.graphics();
    sky.fillStyle(0x87CEEB);
    sky.fillRect(0, 0, width, height * 0.5);
    sky.fillStyle(0x98D8EF);
    sky.fillRect(0, height * 0.3, width, height * 0.2);

    // Sun
    const sun = this.add.graphics();
    sun.fillStyle(0xFFDD44);
    sun.fillCircle(100, 60, 35);
    sun.fillStyle(0xFFEE88);
    sun.fillCircle(100, 60, 28);
    this.tweens.add({
      targets: sun,
      alpha: 0.85,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // Clouds
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.graphics();
      const cx = 100 + i * 200;
      const cy = 40 + Math.random() * 60;
      cloud.fillStyle(0xFFFFFF, 0.8);
      cloud.fillCircle(cx, cy, 20);
      cloud.fillCircle(cx + 20, cy - 5, 15);
      cloud.fillCircle(cx + 15, cy + 5, 18);
      cloud.fillCircle(cx - 15, cy + 3, 16);
      this.tweens.add({
        targets: cloud,
        x: '+=30',
        duration: 8000 + i * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Ground
    this.add.graphics()
      .fillStyle(0x4a8c2a)
      .fillRect(0, height * 0.5, width, height * 0.5)
      .fillStyle(0x5aaa35)
      .fillRect(0, height * 0.5, width, 6);

    // Habitat enclosure
    const encX = 80, encY = height * 0.35, encW = width - 160, encH = height * 0.45;
    const enc = this.add.graphics();
    // Sandy ground
    enc.fillStyle(0xDEB887);
    enc.fillRect(encX, encY, encW, encH);
    // Fence posts
    enc.fillStyle(0x6B4226);
    for (let x = encX; x <= encX + encW; x += 30) {
      enc.fillRect(x, encY - 10, 6, encH + 20);
    }
    // Fence rails
    enc.fillStyle(0x8B5A2B);
    enc.fillRect(encX, encY, encW, 5);
    enc.fillRect(encX, encY + 20, encW, 4);
    enc.fillRect(encX, encY + encH - 5, encW, 5);
    enc.fillRect(encX, encY + encH - 25, encW, 4);

    // Tree in habitat
    const treeG = this.add.graphics();
    treeG.fillStyle(0x6B4226);
    treeG.fillRect(encX + encW - 80, encY + 30, 16, 80);
    treeG.fillStyle(0x228B22);
    treeG.fillCircle(encX + encW - 72, encY + 30, 35);
    treeG.fillStyle(0x2ECC40);
    treeG.fillCircle(encX + encW - 65, encY + 25, 25);

    // Water trough
    this.add.graphics()
      .fillStyle(0x666666)
      .fillRect(encX + 30, encY + encH - 50, 50, 20)
      .fillStyle(0x4488BB)
      .fillRect(encX + 33, encY + encH - 47, 44, 14);

    // Giraffe in habitat
    const giraffeX = encX + encW / 2;
    const giraffeY = encY + encH / 2;
    this.giraffeSprite = this.add.image(giraffeX, giraffeY, 'giraffe').setScale(2.5);

    // Draw beauty products on giraffe
    for (const productId of state.products) {
      this.add.image(giraffeX, giraffeY, 'beauty_' + productId).setScale(2.5);
    }
    // Draw special item on giraffe
    if (state.specialItem) {
      this.add.image(giraffeX, giraffeY, 'special_' + state.specialItem).setScale(2.5);
    }

    this.tweens.add({
      targets: this.giraffeSprite,
      y: '+=4',
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Visitors walking by
    this.visitors = [];
    this.spawnVisitors();

    // Zoo sign
    this.add.graphics()
      .fillStyle(0x4a3728)
      .fillRect(encX + encW / 2 - 60, encY - 50, 120, 35)
      .fillStyle(0x6B5240)
      .fillRect(encX + encW / 2 - 56, encY - 47, 112, 29);

    const missions = state.completedMissions || [];
    const signLabel = missions.includes('signs') ? 'PENGUIN?!' : 'GIRAFFE';
    const signColor = missions.includes('signs') ? '#FF69B4' : '#FFD700';
    this.add.text(encX + encW / 2, encY - 33, signLabel, {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: signColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Mischief consequences from previous nights
    if (missions.includes('fountain')) {
      for (let i = 0; i < 6; i++) {
        const bx = encX + 30 + Math.random() * 50;
        const by = encY + encH - 40;
        const bubble = this.add.graphics();
        bubble.fillStyle(0xAADDFF, 0.6);
        bubble.fillCircle(bx, by, 3 + Math.random() * 4);
        this.tweens.add({
          targets: bubble, y: '-=40', alpha: 0,
          duration: 2000 + Math.random() * 2000, delay: i * 500, repeat: -1,
        });
      }
    }

    if (missions.includes('speakers')) {
      const notes = ['\u266A', '\u266B', '\u266C'];
      for (let i = 0; i < 3; i++) {
        const nx = encX + 40 + Math.random() * (encW - 80);
        const note = this.add.text(nx, encY + encH - 30, notes[i], {
          fontSize: '16px', color: '#FF69B4',
        });
        this.tweens.add({
          targets: note, y: '-=30', alpha: 0,
          duration: 2000 + Math.random() * 1000, delay: i * 800, repeat: -1,
        });
      }
    }

    if (missions.includes('flags')) {
      for (let i = 0; i < 3; i++) {
        const fx = encX + 20 + i * (encW / 3);
        const flag = this.add.graphics();
        flag.fillStyle(0xFFCC33);
        flag.fillRect(fx, encY - 45, 3, 35);
        flag.fillRect(fx + 3, encY - 45, 15, 10);
        flag.fillStyle(0x6B4226);
        flag.fillCircle(fx + 8, encY - 41, 2);
        flag.fillCircle(fx + 13, encY - 39, 2);
      }
    }

    if (missions.includes('statue')) {
      const sx = encX - 40;
      const sy = encY + encH * 0.65;
      const st = this.add.graphics();
      // Pedestal
      st.fillStyle(0x777777);
      st.fillRect(sx - 20, sy + 10, 40, 16);
      st.fillStyle(0x888888);
      st.fillRect(sx - 16, sy + 6, 32, 8);
      // Body
      st.fillStyle(0xAAAAAA);
      st.fillRect(sx - 10, sy - 22, 20, 32);
      // Shoulders
      st.fillRect(sx - 16, sy - 18, 32, 8);
      // Head
      st.fillStyle(0xBBBBBB);
      st.fillCircle(sx, sy - 30, 12);
      // Eyes
      st.fillStyle(0x666666);
      st.fillCircle(sx - 4, sy - 32, 2);
      st.fillCircle(sx + 4, sy - 32, 2);
      // THE MUSTACHE — big, curly, unmistakable
      st.fillStyle(0x222222);
      // Left curl
      st.beginPath();
      st.arc(sx - 7, sy - 27, 6, Math.PI * 0.1, Math.PI * 0.7);
      st.fillPath();
      // Right curl
      st.beginPath();
      st.arc(sx + 7, sy - 27, 6, Math.PI * 0.3, Math.PI * 0.9);
      st.fillPath();
      // Center bar
      st.fillRect(sx - 6, sy - 29, 12, 3);
      // Plaque
      st.fillStyle(0xDAA520);
      st.fillRoundedRect(sx - 18, sy + 26, 36, 14, 3);
      this.add.text(sx, sy + 33, 'DEFACED', {
        fontSize: '7px', fontFamily: 'monospace', color: '#660000',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    if (missions.includes('lights')) {
      const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF];
      for (let i = 0; i < 5; i++) {
        const lx = encX + 20 + i * (encW / 5);
        const light = this.add.graphics();
        light.fillStyle(colors[i], 0.3);
        light.fillCircle(lx, encY + encH - 20, 10);
        this.tweens.add({
          targets: light, alpha: 0.2,
          duration: 300 + i * 100, yoyo: true, repeat: -1,
        });
      }
    }

    if (missions.includes('cafeteria')) {
      this.add.text(width - 100, height * 0.5 + 10, 'TODAY: GRASS', {
        fontSize: '9px', fontFamily: 'monospace', color: '#33AA33',
        fontStyle: 'bold', backgroundColor: '#FFFFFF', padding: { x: 3, y: 2 },
      }).setOrigin(0.5);
    }

    if (missions.includes('office')) {
      const plaque = this.add.graphics();
      plaque.fillStyle(0xDAA520);
      plaque.fillRoundedRect(width - 70, 50, 60, 25, 4);
      this.add.text(width - 40, 62, 'EMPLOYEE\nOF THE MONTH', {
        fontSize: '5px', fontFamily: 'monospace', color: '#333333',
        fontStyle: 'bold', align: 'center',
      }).setOrigin(0.5);
    }

    // Night counter
    this.add.text(width / 2, 20, `Night ${state.night} Approaching...`, {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#333333',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Score display
    this.scoreText = this.add.text(20, 20, `Score: ${state.score}`, {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#333333',
    });

    // Products collected
    if (state.products.length > 0) {
      this.add.text(20, 40, `Beauty ${state.products.length === 1 ? 'item' : 'items'}: ${state.products.length}`, {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#AA3366',
      });
    }

    // Scare button — works with both tap and SPACE
    const scareBtnY = height - 80;
    const scareBtnBg = this.add.graphics();
    scareBtnBg.fillStyle(0xCC4444, 0.15);
    scareBtnBg.fillRoundedRect(width / 2 - 130, scareBtnY - 16, 260, 32, 8);
    scareBtnBg.lineStyle(2, 0xCC4444, 0.4);
    scareBtnBg.strokeRoundedRect(width / 2 - 130, scareBtnY - 16, 260, 32, 8);

    this.scareText = this.add.text(width / 2, scareBtnY, '[ Tap / SPACE to scare visitors! ]', {
      fontSize: '15px',
      fontFamily: 'monospace',
      color: '#CC4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.tweens.add({
      targets: [this.scareText, scareBtnBg],
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    const scareZone = this.add.zone(width / 2 - 130, scareBtnY - 16, 260, 32)
      .setOrigin(0).setInteractive({ useHandCursor: true });
    scareZone.on('pointerdown', () => this.scareVisitors());

    // Wait for night button
    const nightBtnY = height - 40;
    const nightBtnBg = this.add.graphics();
    nightBtnBg.fillStyle(0x1a1a4e, 0.85);
    nightBtnBg.fillRoundedRect(width / 2 - 110, nightBtnY - 18, 220, 36, 8);
    nightBtnBg.lineStyle(2, 0x4466AA, 0.7);
    nightBtnBg.strokeRoundedRect(width / 2 - 110, nightBtnY - 18, 220, 36, 8);

    const nightBtnText = this.add.text(width / 2, nightBtnY, 'Wait for Nightfall  [N]', {
      fontSize: '15px',
      fontFamily: 'monospace',
      color: '#8899CC',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const nightZone = this.add.zone(width / 2 - 110, nightBtnY - 18, 220, 36).setOrigin(0).setInteractive({ useHandCursor: true });
    nightZone.on('pointerover', () => {
      nightBtnBg.clear();
      nightBtnBg.fillStyle(0x2a2a6e, 0.9);
      nightBtnBg.fillRoundedRect(width / 2 - 110, nightBtnY - 18, 220, 36, 8);
      nightBtnBg.lineStyle(2, 0x6688CC, 0.9);
      nightBtnBg.strokeRoundedRect(width / 2 - 110, nightBtnY - 18, 220, 36, 8);
      nightBtnText.setColor('#FFFFFF');
    });
    nightZone.on('pointerout', () => {
      nightBtnBg.clear();
      nightBtnBg.fillStyle(0x1a1a4e, 0.85);
      nightBtnBg.fillRoundedRect(width / 2 - 110, nightBtnY - 18, 220, 36, 8);
      nightBtnBg.lineStyle(2, 0x4466AA, 0.7);
      nightBtnBg.strokeRoundedRect(width / 2 - 110, nightBtnY - 18, 220, 36, 8);
      nightBtnText.setColor('#8899CC');
    });

    const goToNight = () => {
      // Fade out music gently, then transition
      if (this.morningMusic) {
        this.tweens.add({
          targets: this.morningMusic,
          volume: 0,
          duration: 2000,
          onComplete: () => this.morningMusic.stop(),
        });
      }
      this.cameras.main.fadeOut(2000, 0, 0, 10);
      this.time.delayedCall(2000, () => {
        this.scene.start('NightScene', this.gameState);
      });
    };

    nightZone.on('pointerdown', goToNight);
    this.input.keyboard.on('keydown-N', goToNight);

    // Scare mechanic
    this.scareScore = 0;
    this.input.keyboard.on('keydown-SPACE', () => this.scareVisitors());

    // Morning music - start at random position, fade in
    this.morningMusic = this.sound.add('music_morning', { loop: true, volume: 0 });
    this.morningMusic.play({ seek: Math.random() * 60 });
    this.tweens.add({
      targets: this.morningMusic,
      volume: 0.5,
      duration: 4000,
      ease: 'Sine.easeIn',
    });

    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  spawnVisitors() {
    const { width, height } = this.cameras.main;
    const encY = height * 0.35;

    // Initial batch staggered
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 1500 + Math.random() * 2000, () => {
        this.createVisitor(width + 30, encY - 20 + (Math.random() - 0.5) * 30);
      });
    }

    // Continuous stream — keep spawning new visitors every few seconds
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        if (this.visitors.length < 6) {
          this.createVisitor(width + 30, encY - 20 + (Math.random() - 0.5) * 30);
        }
      },
    });
  }

  createVisitor(startX, y) {
    const { width } = this.cameras.main;
    const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0xDDA0DD];
    const color = Phaser.Utils.Array.GetRandom(colors);

    const visitor = this.add.graphics();
    // Body
    visitor.fillStyle(color);
    visitor.fillRoundedRect(-8, 0, 16, 20, 3);
    // Head
    visitor.fillStyle(0xDEB887);
    visitor.fillCircle(0, -4, 8);
    // Eyes
    visitor.fillStyle(0x000000);
    visitor.fillCircle(-3, -5, 1.5);
    visitor.fillCircle(3, -5, 1.5);

    visitor.setPosition(startX, y);
    visitor.setScale(1.5);
    visitor.setData('scared', false);

    this.visitors.push(visitor);

    // Walk across
    this.tweens.add({
      targets: visitor,
      x: -50,
      duration: 8000 + Math.random() * 4000,
      onComplete: () => {
        const idx = this.visitors.indexOf(visitor);
        if (idx > -1) this.visitors.splice(idx, 1);
        visitor.destroy();
        // Spawn replacement
        this.createVisitor(width + 30, y + (Math.random() - 0.5) * 30);
      },
    });

    // Pause near giraffe
    const pauseX = 200 + Math.random() * 400;
    this.time.delayedCall(2000, () => {
      if (!visitor.getData('scared')) {
        // Show camera emoji above visitor
        const cam = this.add.text(visitor.x, visitor.y - 30, '📸', {
          fontSize: '16px',
        }).setOrigin(0.5);
        this.tweens.add({
          targets: cam,
          y: '-=10',
          alpha: 0,
          duration: 1500,
          onComplete: () => cam.destroy(),
        });
      }
    });
  }

  scareVisitors() {
    const isLion = this.gameState.specialItem === 'lion_costume';
    const scareRange = isLion ? 500 : 300;
    const pointsMultiplier = isLion ? 2 : 1;

    // Giraffe animation — bigger if lion
    this.tweens.add({
      targets: this.giraffeSprite,
      scaleX: isLion ? 3.5 : 3,
      scaleY: isLion ? 3.3 : 2.8,
      duration: isLion ? 250 : 150,
      yoyo: true,
    });

    // Lion roar or regular scare
    if (isLion) {
      this.sound.play('scare_lion', { volume: 0.7 });
      this.cameras.main.shake(200, 0.008);

      // Show ROAR text
      const roarText = this.add.text(this.giraffeSprite.x, this.giraffeSprite.y - 80, 'ROAR!!!', {
        fontSize: '28px',
        fontFamily: 'monospace',
        color: '#FF4400',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);
      this.tweens.add({
        targets: roarText,
        y: '-=40',
        scaleX: 1.5, scaleY: 1.5,
        alpha: 0,
        duration: 1200,
        onComplete: () => roarText.destroy(),
      });
    }

    let totalPoints = 0;
    let scared = 0;
    for (const visitor of this.visitors) {
      if (visitor.getData('scared')) continue;
      const dist = Phaser.Math.Distance.Between(
        this.giraffeSprite.x, this.giraffeSprite.y,
        visitor.x, visitor.y
      );
      if (dist < scareRange) {
        visitor.setData('scared', true);
        scared++;

        // Closer = more points (10-30 range), doubled for lion
        const points = Math.round((10 + 20 * (1 - dist / scareRange)) * pointsMultiplier);

        // Scared reaction - show points
        const emoji = isLion ? '🦁' : '😱';
        const excl = this.add.text(visitor.x, visitor.y - 30, `${emoji} +${points}`, {
          fontSize: isLion ? '20px' : '16px',
          fontFamily: 'monospace',
          color: '#FFD700',
        }).setOrigin(0.5);
        this.tweens.add({
          targets: excl,
          y: '-=20',
          alpha: 0,
          duration: 1000,
          onComplete: () => excl.destroy(),
        });

        totalPoints += points;

        // Run away faster (much faster if lion)
        this.tweens.killTweensOf(visitor);
        this.tweens.add({
          targets: visitor,
          x: visitor.x < this.giraffeSprite.x ? -50 : this.cameras.main.width + 50,
          duration: isLion ? 500 : 1000,
          ease: 'Quad.easeIn',
          onComplete: () => {
            const idx = this.visitors.indexOf(visitor);
            if (idx > -1) this.visitors.splice(idx, 1);
            visitor.destroy();
          },
        });
      }
    }

    if (scared > 0) {
      this.scareScore += totalPoints;
      this.gameState.score += totalPoints;
      this.scoreText.setText(`Score: ${this.gameState.score}`);

      // Play scare sound (always for lion, ~30% otherwise)
      if (!isLion && Math.random() < 0.3) {
        const key = Math.random() < 0.5 ? 'scare_elephant' : 'scare_piano';
        this.sound.play(key, { volume: 0.4 });
      }
      const scoreText = this.add.text(this.giraffeSprite.x, this.giraffeSprite.y - 60, `+${totalPoints}`, {
        fontSize: '20px',
        fontFamily: 'monospace',
        color: '#FFD700',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.tweens.add({
        targets: scoreText,
        y: '-=30',
        alpha: 0,
        duration: 1000,
        onComplete: () => scoreText.destroy(),
      });
    }
  }
}
