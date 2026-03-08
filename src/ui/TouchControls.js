import Phaser from 'phaser';

export default class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;

    // Movement output (-1 to 1)
    this.moveX = 0;
    this.moveY = 0;

    // Action output
    this.isActionDown = false;
    this._actionJustDown = false;

    // Pointer tracking
    this.movePointerId = null;
    this.moveOriginX = 0;
    this.moveOriginY = 0;
    this.JOYSTICK_RADIUS = 50;
    this.DEAD_ZONE = 8;
    this.actionPointerId = null;

    const cam = scene.cameras.main;
    const zoom = cam.zoom || 1;
    const midX = cam.width / 2;
    const midY = cam.height / 2;

    // Visual container (center-anchored, zoom-compensated)
    this.container = scene.add.container(midX, midY)
      .setScrollFactor(0).setDepth(950).setScale(1 / zoom).setVisible(false);

    // Joystick visuals (drawn dynamically at touch origin)
    this.joyBase = scene.add.graphics();
    this.joyThumb = scene.add.graphics();
    this.container.add([this.joyBase, this.joyThumb]);

    // Action zone — right side of screen (invisible, touch-only)
    this.ACTION_BTN_RADIUS = 28;

    // Events
    scene.input.on('pointerdown', this._onDown, this);
    scene.input.on('pointermove', this._onMove, this);
    scene.input.on('pointerup', this._onUp, this);
  }

  _onDown(pointer) {
    // Only activate touch controls for actual touch input, not mouse
    if (!pointer.wasTouch) return;

    if (!this.enabled) {
      this.enabled = true;
      this.container.setVisible(true);
    }

    const cam = this.scene.cameras.main;
    const sx = pointer.x;
    const sy = pointer.y;

    // Right side or near action button → action
    const btnScreenX = cam.width - 65;
    const btnScreenY = cam.height - 65;
    const distToBtn = Phaser.Math.Distance.Between(sx, sy, btnScreenX, btnScreenY);

    if (distToBtn < this.ACTION_BTN_RADIUS * 2 || sx > cam.width * 0.7) {
      this.actionPointerId = pointer.id;
      this.isActionDown = true;
      this._actionJustDown = true;
    } else if (this.movePointerId === null) {
      // Left/center → joystick
      this.movePointerId = pointer.id;
      this.moveOriginX = sx;
      this.moveOriginY = sy;
      this._drawJoystick(sx, sy, sx, sy);
    }
  }

  _onMove(pointer) {
    if (!pointer.wasTouch) return;
    if (pointer.id === this.movePointerId && pointer.isDown) {
      const dx = pointer.x - this.moveOriginX;
      const dy = pointer.y - this.moveOriginY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > this.DEAD_ZONE) {
        const clamped = Math.min(dist, this.JOYSTICK_RADIUS);
        this.moveX = (dx / dist) * (clamped / this.JOYSTICK_RADIUS);
        this.moveY = (dy / dist) * (clamped / this.JOYSTICK_RADIUS);
      } else {
        this.moveX = 0;
        this.moveY = 0;
      }
      this._drawJoystick(this.moveOriginX, this.moveOriginY, pointer.x, pointer.y);
    }
  }

  _onUp(pointer) {
    if (!pointer.wasTouch) return;
    if (pointer.id === this.movePointerId) {
      this.movePointerId = null;
      this.moveX = 0;
      this.moveY = 0;
      this.joyBase.clear();
      this.joyThumb.clear();
    }
    if (pointer.id === this.actionPointerId) {
      this.actionPointerId = null;
      this.isActionDown = false;
    }
  }

  _drawJoystick(baseScreenX, baseScreenY, thumbScreenX, thumbScreenY) {
    // Container at (midX, midY), scale 1/zoom — camera zoom cancels scale,
    // so local coords = screen coords minus container center.
    const cam = this.scene.cameras.main;
    const bx = baseScreenX - cam.width / 2;
    const by = baseScreenY - cam.height / 2;
    const tx = thumbScreenX - cam.width / 2;
    const ty = thumbScreenY - cam.height / 2;

    // Clamp thumb
    const dx = tx - bx, dy = ty - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let cx = tx, cy = ty;
    if (dist > this.JOYSTICK_RADIUS) {
      cx = bx + (dx / dist) * this.JOYSTICK_RADIUS;
      cy = by + (dy / dist) * this.JOYSTICK_RADIUS;
    }

    this.joyBase.clear();
    this.joyBase.fillStyle(0xFFFFFF, 0.1);
    this.joyBase.fillCircle(bx, by, this.JOYSTICK_RADIUS);
    this.joyBase.lineStyle(2, 0xFFFFFF, 0.2);
    this.joyBase.strokeCircle(bx, by, this.JOYSTICK_RADIUS);

    this.joyThumb.clear();
    this.joyThumb.fillStyle(0xFFFFFF, 0.3);
    this.joyThumb.fillCircle(cx, cy, 14);
  }

  consumeJustDown() {
    if (this._actionJustDown) {
      this._actionJustDown = false;
      return true;
    }
    return false;
  }

  destroy() {
    this.scene.input.off('pointerdown', this._onDown, this);
    this.scene.input.off('pointermove', this._onMove, this);
    this.scene.input.off('pointerup', this._onUp, this);
    this.container.destroy();
  }
}
