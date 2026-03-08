import Phaser from 'phaser';

export default class DialogBox {
  constructor(scene) {
    this.scene = scene;
    this.isOpen = false;
    this.callback = null;

    const cam = scene.cameras.main;
    const zoom = cam.zoom || 1;
    const midX = cam.width / 2;
    const midY = cam.height / 2;

    // Container at viewport center + counter-scale so zoom has no visual effect
    this.container = scene.add.container(midX, midY)
      .setScrollFactor(0).setDepth(1000).setVisible(false).setScale(1 / zoom);

    // All child positions are relative to screen center:
    //   child (cx, cy) → screen (midX + cx/zoom, midY + cy/zoom)
    const bw = cam.width - 60;
    const bh = 180;
    const bx = -bw / 2;               // centered horizontally
    const by = midY - bh - 20 - 10;   // near bottom of screen, relative to center

    // Background panel
    this.bg = scene.add.graphics();
    this.bg.fillStyle(0x1a1a2e, 0.92);
    this.bg.fillRoundedRect(bx, by, bw, bh, 12);
    this.bg.lineStyle(3, 0xFFD700, 0.8);
    this.bg.strokeRoundedRect(bx, by, bw, bh, 12);
    this.container.add(this.bg);

    // Speaker name
    this.nameText = scene.add.text(bx + 16, by + 12, '', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#FFD700',
      fontStyle: 'bold',
    });
    this.container.add(this.nameText);

    // Dialog text
    this.dialogText = scene.add.text(bx + 16, by + 36, '', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#FFFFFF',
      wordWrap: { width: bw - 40 },
      lineSpacing: 4,
    });
    this.container.add(this.dialogText);

    // Choice buttons — visuals in container, hit detection via scene-level input
    this.choiceButtons = [];
    this.choiceTexts = [];
    this.choiceLocalBounds = [];
    this.choiceScreenBounds = [];

    for (let i = 0; i < 2; i++) {
      const cbg = scene.add.graphics();
      const cby = by + bh - 42;
      const cbw = bw / 2 - 28;
      const cbx = bx + 16 + i * (bw / 2 - 12);

      this._drawChoiceBtn(cbg, cbx, cby, cbw, false);

      const ct = scene.add.text(cbx + cbw / 2, cby + 15, '', {
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#88CCFF',
      }).setOrigin(0.5);

      this.container.add([cbg, ct]);
      this.choiceButtons.push({ bg: cbg });
      this.choiceTexts.push(ct);
      this.choiceLocalBounds.push({ x: cbx, y: cby, w: cbw, h: 30 });
      // Screen-space bounds: camera zoom (1.5x) cancels container scale (1/1.5),
      // so effective screen pos = containerPos + childLocalPos, size unchanged.
      this.choiceScreenBounds.push({
        x: midX + cbx,
        y: midY + cby,
        w: cbw,
        h: 30,
      });
    }

    // Keyboard shortcut hints
    this.hintText = scene.add.text(bx + bw - 16, by + 12, '[1] / [2]', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#666688',
    }).setOrigin(1, 0);
    this.container.add(this.hintText);

    // Keyboard input for choices
    scene.input.keyboard.on('keydown-ONE', () => { if (this.isOpen) this.selectChoice(0); });
    scene.input.keyboard.on('keydown-TWO', () => { if (this.isOpen) this.selectChoice(1); });

    // Scene-level pointer handlers — pointer.x/y are game-resolution (screen) coords,
    // unaffected by camera zoom, so they match our scrollFactor(0) button positions.
    scene.input.on('pointerdown', (pointer) => {
      if (!this.isOpen) return;
      for (let i = 0; i < this.choiceScreenBounds.length; i++) {
        const b = this.choiceScreenBounds[i];
        if (this.choiceTexts[i].text &&
            pointer.x >= b.x && pointer.x <= b.x + b.w &&
            pointer.y >= b.y && pointer.y <= b.y + b.h) {
          this.selectChoice(i);
          break;
        }
      }
    });

    scene.input.on('pointermove', (pointer) => {
      if (!this.isOpen) return;
      let anyHover = false;
      for (let i = 0; i < this.choiceScreenBounds.length; i++) {
        const b = this.choiceScreenBounds[i];
        const lb = this.choiceLocalBounds[i];
        const inside = this.choiceTexts[i].text &&
          pointer.x >= b.x && pointer.x <= b.x + b.w &&
          pointer.y >= b.y && pointer.y <= b.y + b.h;

        this._drawChoiceBtn(this.choiceButtons[i].bg, lb.x, lb.y, lb.w, inside);
        this.choiceTexts[i].setColor(inside ? '#FFFFFF' : '#88CCFF');
        if (inside) anyHover = true;
      }
      scene.sys.canvas.style.cursor = anyHover ? 'pointer' : 'default';
    });
  }

  _drawChoiceBtn(g, x, y, w, hover) {
    g.clear();
    g.fillStyle(hover ? 0x3a3a6e : 0x2a2a4e, 0.9);
    g.fillRoundedRect(x, y, w, 30, 6);
    g.lineStyle(2, hover ? 0x66AAFF : 0x4488FF, hover ? 0.9 : 0.6);
    g.strokeRoundedRect(x, y, w, 30, 6);
  }

  show(speakerName, text, choices, callback) {
    this.isOpen = true;
    this.callback = callback;
    this.container.setVisible(true);

    this.nameText.setText(speakerName);
    this.dialogText.setText(text);

    for (let i = 0; i < 2; i++) {
      if (choices && choices[i]) {
        this.choiceTexts[i].setText(choices[i]);
      } else {
        this.choiceTexts[i].setText('');
      }
    }
  }

  selectChoice(index) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.setVisible(false);
    this.scene.sys.canvas.style.cursor = 'default';
    if (this.callback) this.callback(index);
  }

  hide() {
    this.isOpen = false;
    this.container.setVisible(false);
    this.scene.sys.canvas.style.cursor = 'default';
  }

  destroy() {
    this.scene.sys.canvas.style.cursor = 'default';
    this.container.destroy();
  }
}
