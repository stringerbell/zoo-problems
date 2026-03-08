import Phaser from 'phaser';
import { TILE, ZOO_MAP, LEVELS, MISSIONS, ANIMALS, DIALOGUES, BEAUTY_PRODUCTS, SPECIAL_ITEMS } from '../data/gameData.js';
import DialogBox from '../ui/DialogBox.js';
import HUD from '../ui/HUD.js';
import TouchControls from '../ui/TouchControls.js';

const TILE_SIZE = 32;
const MAP_COLS = 40;
const MAP_ROWS = 30;

export default class NightScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NightScene' });
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
    const state = this.gameState;
    const levelIndex = Math.min(state.night - 1, LEVELS.length - 1);
    this.levelConfig = LEVELS[levelIndex];

    // World bounds
    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Draw tilemap
    this.drawMap();

    // Night overlay (dark blue tint)
    this.nightOverlay = this.add.graphics().setDepth(500);
    this.nightOverlay.fillStyle(0x0a0a2e, 0.45);
    this.nightOverlay.fillRect(0, 0, worldW, worldH);

    // Player (giraffe)
    this.player = this.physics.add.sprite(20 * TILE_SIZE + 16, 6 * TILE_SIZE + 16, 'giraffe')
      .setDepth(600)
      .setCollideWorldBounds(true)
      .setScale(0.9);
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(6, 18);

    // Beauty overlays on player
    this.beautyOverlays = [];
    for (const productId of state.products) {
      const overlay = this.add.image(this.player.x, this.player.y, 'beauty_' + productId)
        .setDepth(601).setScale(0.9);
      this.beautyOverlays.push(overlay);
    }
    // Special item overlay
    if (state.specialItem) {
      const sOverlay = this.add.image(this.player.x, this.player.y, 'special_' + state.specialItem)
        .setDepth(602).setScale(0.9);
      this.beautyOverlays.push(sOverlay);
    }

    this.playerSpeed = 120;
    this.isHidden = false;
    this.isSpotted = false;
    this.isCaught = false;

    // Shared set of occupied tile positions to prevent overlaps
    this.usedPositions = new Set();

    // Guards
    this.guards = [];
    this.spawnGuards();

    // NPCs
    this.npcs = [];
    this.spawnNPCs();

    // Chests
    this.chests = [];
    this.giantChest = null;
    this.spawnChests();

    // Mission markers
    this.missionMarkers = [];
    this.completedMissions = [];
    this.spawnMissions();

    // Camera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);

    // Input
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.arrowKeys = this.input.keyboard.createCursorKeys();
    this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // UI
    this.dialogBox = new DialogBox(this);
    this.hud = new HUD(this);
    this.hud.updateLives(state.lives);
    this.hud.updateNight(state.night, this.levelConfig.name);
    this.updateMissionHUD();

    // Transition guard
    this.transitioning = false;

    // Timer
    this.timeRemaining = this.levelConfig.timeLimit;
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true,
    });

    // Interaction prompt
    this.interactPrompt = this.add.text(0, 0, '[SPACE]', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#FFD700',
      backgroundColor: '#1a1a2eCC',
      padding: { x: 6, y: 3 },
    }).setDepth(800).setVisible(false).setOrigin(0.5);

    // Collision tiles setup (includes zone boundaries)
    this.wallTiles = new Set();
    const { maxRow: zMaxRow } = this.levelConfig.zone;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tile = ZOO_MAP[r][c];
        if (tile === TILE.WALL || tile === TILE.FENCE || tile === TILE.WATER) {
          this.wallTiles.add(`${c},${r}`);
        }
        // Block tiles beyond zone boundary
        if (r > zMaxRow) {
          this.wallTiles.add(`${c},${r}`);
        }
      }
    }

    // Night intro text (scale to counter camera zoom)
    const camZoom = this.cameras.main.zoom;
    const introText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      `Night ${state.night}\n${this.levelConfig.name}`,
      {
        fontSize: '28px',
        fontFamily: 'monospace',
        color: '#FFD700',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setScale(1 / camZoom);

    this.tweens.add({
      targets: introText,
      alpha: 0,
      delay: 1500,
      duration: 500,
      onComplete: () => introText.destroy(),
    });

    this.cameras.main.fadeIn(800, 0, 0, 10);

    // Night music - random start, fade in
    this.nightMusic = this.sound.add('music_night', { loop: true, volume: 0 });
    this.nightMusic.play({ seek: Math.random() * 60 });
    this.tweens.add({
      targets: this.nightMusic,
      volume: 0.15,
      duration: 4000,
      ease: 'Sine.easeIn',
    });

    // Unified SPACE action — smart based on context
    this.actionKey.on('down', () => this.handleAction());

    // Touch controls (joystick + action button, visible on first touch)
    this.touch = new TouchControls(this);
  }

  drawMap() {
    const { minRow, maxRow } = this.levelConfig.zone;
    const tileKeys = ['tile_grass', 'tile_path', 'tile_wall', 'tile_fence', 'tile_water', 'tile_bush', 'tile_exhibit', 'tile_gate'];

    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tile = ZOO_MAP[r][c];
        const key = tileKeys[tile] || 'tile_grass';
        const img = this.add.image(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, key).setDepth(0);

        // Darken tiles beyond zone
        if (r > maxRow) {
          img.setTint(0x222222);
          img.setAlpha(0.4);
        }
      }
    }

    // Zone barrier visual
    if (maxRow < MAP_ROWS - 1) {
      const barrierY = (maxRow + 1) * TILE_SIZE;
      const barrier = this.add.graphics().setDepth(200);
      barrier.lineStyle(3, 0xFF4444, 0.6);
      barrier.lineBetween(0, barrierY, MAP_COLS * TILE_SIZE, barrierY);

      this.add.text(MAP_COLS * TILE_SIZE / 2, barrierY + 12, 'AREA LOCKED — EXPLORE IN LATER NIGHTS', {
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#FF6666',
        stroke: '#000000',
        strokeThickness: 2,
      }).setDepth(200).setOrigin(0.5);
    }

    // Exhibit labels (only in accessible zone)
    const exhibitLocations = [
      { x: 12, y: 2, name: 'Lions' },
      { x: 28, y: 2, name: 'Bears' },
      { x: 12, y: 10, name: 'Monkeys' },
      { x: 28, y: 10, name: 'Reptiles' },
      { x: 12, y: 25, name: 'Penguins' },
      { x: 28, y: 25, name: 'Birds' },
    ];
    for (const ex of exhibitLocations) {
      if (ex.y > maxRow) continue;
      this.add.text(ex.x * TILE_SIZE, (ex.y - 1) * TILE_SIZE + 8, ex.name, {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#FFFFFF',
        backgroundColor: '#4a3728',
        padding: { x: 4, y: 2 },
      }).setDepth(100).setOrigin(0.5, 1);
    }

    // Building labels (only if in zone)
    if (maxRow >= 15) {
      this.add.text(20 * TILE_SIZE, 14.5 * TILE_SIZE, 'GIFT SHOP', {
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#FFD700',
      }).setDepth(100).setOrigin(0.5);

      this.add.text(20 * TILE_SIZE, 15.5 * TILE_SIZE, '& CAFE', {
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#FFD700',
      }).setDepth(100).setOrigin(0.5);
    }
  }

  getWalkableTiles() {
    const { minRow, maxRow } = this.levelConfig.zone;
    const tiles = [];
    for (let r = minRow + 1; r <= maxRow - 1; r++) {
      for (let c = 2; c < MAP_COLS - 2; c++) {
        const tile = ZOO_MAP[r][c];
        if (tile === TILE.GRASS || tile === TILE.PATH || tile === TILE.GATE) {
          tiles.push({ x: c, y: r });
        }
      }
    }
    return tiles;
  }

  pickSpreadPositions(count, tiles, minDist = 5) {
    const picked = [];
    const shuffled = Phaser.Utils.Array.Shuffle([...tiles]);
    for (const tile of shuffled) {
      if (picked.length >= count) break;
      // Skip tiles already used by other spawn groups
      const key = `${tile.x},${tile.y}`;
      if (this.usedPositions.has(key)) continue;
      const tooClose = picked.some(p =>
        Math.abs(p.x - tile.x) + Math.abs(p.y - tile.y) < minDist
      );
      // Also check distance from all previously used positions
      const nearUsed = [...this.usedPositions].some(k => {
        const [ux, uy] = k.split(',').map(Number);
        return Math.abs(tile.x - ux) + Math.abs(tile.y - uy) < minDist;
      });
      // Avoid player start area (col 20, row 6)
      const nearStart = Math.abs(tile.x - 20) + Math.abs(tile.y - 6) < 4;
      if (!tooClose && !nearUsed && !nearStart) {
        picked.push(tile);
        this.usedPositions.add(key);
      }
    }
    return picked;
  }

  spawnGuards() {
    const { minRow, maxRow } = this.levelConfig.zone;
    const midRow = Math.floor((minRow + maxRow) / 2);
    const midCol = Math.floor(MAP_COLS / 2);

    // Divide zone into quadrants for patrol routes
    const quadrants = [
      { minC: 2, maxC: midCol - 1, minR: minRow + 2, maxR: midRow },
      { minC: midCol + 1, maxC: MAP_COLS - 3, minR: minRow + 2, maxR: midRow },
      { minC: 2, maxC: midCol - 1, minR: Math.min(midRow + 1, maxRow - 2), maxR: maxRow - 1 },
      { minC: midCol + 1, maxC: MAP_COLS - 3, minR: Math.min(midRow + 1, maxRow - 2), maxR: maxRow - 1 },
    ];

    for (let i = 0; i < this.levelConfig.guardCount; i++) {
      const q = quadrants[i % quadrants.length];

      // Pick 4 random walkable waypoints in this quadrant
      const candidates = [];
      for (let r = q.minR; r <= q.maxR; r++) {
        for (let c = q.minC; c <= q.maxC; c++) {
          const tile = ZOO_MAP[r][c];
          if (tile === TILE.GRASS || tile === TILE.PATH || tile === TILE.GATE) {
            candidates.push({ x: c, y: r });
          }
        }
      }
      Phaser.Utils.Array.Shuffle(candidates);
      const patrol = [];
      for (const cand of candidates) {
        if (patrol.length >= 4) break;
        const tooClose = patrol.some(p => Math.abs(p.x - cand.x) + Math.abs(p.y - cand.y) < 3);
        if (!tooClose) patrol.push(cand);
      }

      if (patrol.length < 2) continue;

      const startIdx = Math.floor(Math.random() * patrol.length);
      const start = patrol[startIdx];

      const guard = this.physics.add.sprite(
        start.x * TILE_SIZE + TILE_SIZE / 2,
        start.y * TILE_SIZE + TILE_SIZE / 2,
        'guard'
      ).setDepth(550).setScale(0.9);
      guard.body.setSize(20, 28);

      const flashlight = this.add.image(guard.x, guard.y, 'flashlight')
        .setDepth(510).setAlpha(0.6).setOrigin(0.5, 0);

      guard.setData('patrol', patrol);
      guard.setData('patrolIndex', startIdx);
      guard.setData('flashlight', flashlight);
      guard.setData('speed', this.levelConfig.guardSpeed);
      guard.setData('visionRange', this.levelConfig.guardVision);
      guard.setData('alertLevel', 0);
      guard.setData('lastKnownPlayerPos', null);
      guard.setData('facingAngle', Math.random() * Math.PI * 2);

      this.guards.push(guard);
      this.moveGuardToNext(guard);
    }
  }

  // Check whether a pixel position sits on a walkable tile (not wall/fence/water)
  isWalkableTile(px, py) {
    const col = Math.floor(px / TILE_SIZE);
    const row = Math.floor(py / TILE_SIZE);
    return !this.wallTiles.has(`${col},${row}`);
  }

  // Move a guard by (dx, dy) but only if the destination is walkable.
  // Tries full move, then axis-separated slides so guards navigate around corners.
  tryMoveGuard(guard, dx, dy) {
    const nx = guard.x + dx;
    const ny = guard.y + dy;

    if (this.isWalkableTile(nx, ny)) {
      guard.x = nx;
      guard.y = ny;
      return;
    }
    // Try sliding along each axis individually
    if (dx !== 0 && this.isWalkableTile(guard.x + dx, guard.y)) {
      guard.x += dx;
    } else if (dy !== 0 && this.isWalkableTile(guard.x, guard.y + dy)) {
      guard.y += dy;
    }
  }

  moveGuardToNext(guard) {
    // Stop any existing movement
    const oldTween = guard.getData('moveTween');
    if (oldTween && oldTween.isPlaying) oldTween.stop();

    const patrol = guard.getData('patrol');
    let idx = guard.getData('patrolIndex');
    idx = (idx + 1) % patrol.length;
    guard.setData('patrolIndex', idx);

    const target = patrol[idx];
    guard.setData('patrolTarget', {
      x: target.x * TILE_SIZE + TILE_SIZE / 2,
      y: target.y * TILE_SIZE + TILE_SIZE / 2,
    });
    guard.setData('patrolPaused', false);
  }

  // Called each frame from updateGuards — moves patrolling guards toward their waypoint
  updatePatrolMovement(guard, dt) {
    if (guard.getData('alertLevel') !== 0) return;
    if (guard.getData('patrolPaused')) return;

    const target = guard.getData('patrolTarget');
    if (!target) return;

    const dx = target.x - guard.x;
    const dy = target.y - guard.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 4) {
      // Reached waypoint — pause then advance
      guard.setData('patrolPaused', true);
      this.time.delayedCall(500 + Math.random() * 1000, () => {
        if (guard.active && guard.getData('alertLevel') === 0) {
          this.moveGuardToNext(guard);
        }
      });
      return;
    }

    const speed = guard.getData('speed');
    const step = Math.min(speed * dt, dist);
    const mx = (dx / dist) * step;
    const my = (dy / dist) * step;

    this.tryMoveGuard(guard, mx, my);
    guard.setData('facingAngle', Math.atan2(dy, dx));
  }

  returnToPatrol(guard) {
    guard.setData('alertLevel', 0);
    guard.setData('suspicionTimer', 0);
    guard.setData('lastKnownPlayerPos', null);
    this.moveGuardToNext(guard);
  }

  spawnNPCs() {
    const walkable = this.getWalkableTiles();
    const positions = this.pickSpreadPositions(this.levelConfig.npcs.length, walkable, 6);

    const animalKeys = this.levelConfig.npcs;
    for (let i = 0; i < animalKeys.length; i++) {
      if (i >= positions.length) break;
      const key = animalKeys[i];
      const animalData = ANIMALS[key];
      const pos = positions[i];

      const npc = this.add.image(
        pos.x * TILE_SIZE + TILE_SIZE / 2,
        pos.y * TILE_SIZE + TILE_SIZE / 2,
        'animal_' + key
      ).setDepth(550).setScale(1.1);

      // Randomize allegiance based on friendlyChance
      const isFriendly = Math.random() < (animalData.friendlyChance || 0.5);
      const runtimeData = { ...animalData, type: isFriendly ? 'friendly' : 'saboteur' };

      // Name label — same color for all, no giveaways
      const label = this.add.text(npc.x, npc.y - 22, animalData.name.split(' ')[0], {
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#CCDDEE',
        stroke: '#000000',
        strokeThickness: 2,
      }).setDepth(560).setOrigin(0.5);

      // Speech bubble hint — everyone looks talkable
      const bubble = this.add.text(npc.x + 16, npc.y - 20, '💬', {
        fontSize: '10px',
      }).setDepth(560).setAlpha(0);
      this.tweens.add({ targets: bubble, alpha: 0.6, duration: 1500, yoyo: true, repeat: -1 });

      // Bobbing animation
      this.tweens.add({
        targets: [npc, label],
        y: '-=3',
        duration: 1500 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      npc.setData('animalKey', key);
      npc.setData('animalData', runtimeData);
      npc.setData('talked', false);

      this.npcs.push(npc);
    }
  }

  spawnChests() {
    // Filter out already-collected products
    const available = BEAUTY_PRODUCTS.filter(p => !this.gameState.products.includes(p.id));
    Phaser.Utils.Array.Shuffle(available);

    const count = Math.min(this.levelConfig.chestCount, available.length);
    const walkable = this.getWalkableTiles();
    const positions = this.pickSpreadPositions(count, walkable, 5);

    for (let i = 0; i < Math.min(count, positions.length); i++) {
      const pos = positions[i];
      const product = available[i];

      const chest = this.add.image(
        pos.x * TILE_SIZE + TILE_SIZE / 2,
        pos.y * TILE_SIZE + TILE_SIZE / 2,
        'chest'
      ).setDepth(550).setScale(1);

      // Sparkle effect
      const sparkle = this.add.image(chest.x, chest.y - 16, 'sparkle')
        .setDepth(555).setAlpha(0);
      this.tweens.add({
        targets: sparkle,
        alpha: 1,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 600,
        yoyo: true,
        repeat: -1,
      });

      chest.setData('product', product);
      chest.setData('sparkle', sparkle);
      this.chests.push(chest);
    }
  }

  spawnMissions() {
    const walkable = this.getWalkableTiles();
    const positions = this.pickSpreadPositions(this.levelConfig.missions.length, walkable, 6);

    const missionIds = this.levelConfig.missions;
    for (let i = 0; i < missionIds.length; i++) {
      if (i >= positions.length) break;
      const mission = MISSIONS.find(m => m.id === missionIds[i]);
      const pos = positions[i];

      const marker = this.add.image(
        pos.x * TILE_SIZE + TILE_SIZE / 2,
        pos.y * TILE_SIZE + TILE_SIZE / 2,
        'mission_marker'
      ).setDepth(540).setScale(1.2);

      this.tweens.add({
        targets: marker,
        y: '-=6',
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Mission label
      this.add.text(marker.x, marker.y + 20, mission.name, {
        fontSize: '8px',
        fontFamily: 'monospace',
        color: '#FF6B6B',
        stroke: '#000000',
        strokeThickness: 2,
      }).setDepth(545).setOrigin(0.5);

      marker.setData('mission', mission);
      marker.setData('progress', 0);
      marker.setData('required', 3); // 3 seconds of holding E
      this.missionMarkers.push(marker);
    }
  }

  update(time, delta) {
    if (this.transitioning || !this.dialogBox) return;
    if (this.isCaught || this.dialogBox.isOpen) {
      this.player.body.setVelocity(0);
      return;
    }

    // Check touch action button
    if (this.touch && this.touch.consumeJustDown()) {
      this.handleAction();
    }

    this.handleMovement();
    this.updateGuards(delta);
    this.updateFlashlights();
    this.checkProximity(delta);
    this.checkCollisions();
    this.updateBeautyOverlays();
    this.hud.updateStealth(this.isHidden, this.isSpotted);
    this.hud.updateTimer(this.timeRemaining);
  }

  handleMovement() {
    // Spotted = panic, slightly slower. Chased = fear, noticeably slower.
    const anyChasing = this.guards.some(g => g.getData('alertLevel') === 2);
    const speed = anyChasing ? this.playerSpeed * 0.82 : this.isSpotted ? this.playerSpeed * 0.92 : this.playerSpeed;
    let vx = 0, vy = 0;

    // Keyboard movement
    if (this.cursors.left.isDown || this.arrowKeys.left.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.arrowKeys.right.isDown) vx = speed;
    if (this.cursors.up.isDown || this.arrowKeys.up.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.arrowKeys.down.isDown) vy = speed;

    // Touch joystick movement (overrides keyboard if active)
    if (this.touch && (this.touch.moveX !== 0 || this.touch.moveY !== 0)) {
      vx = this.touch.moveX * speed;
      vy = this.touch.moveY * speed;
    }

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag > speed) {
        vx = (vx / mag) * speed;
        vy = (vy / mag) * speed;
      }
    }

    // Check wall collision at destination
    if (vx !== 0 || vy !== 0) {
      const nextX = this.player.x + (vx > 0 ? 10 : -10);
      const nextY = this.player.y + (vy > 0 ? 14 : -14);
      const tileCol = Math.floor(nextX / TILE_SIZE);
      const tileRow = Math.floor(nextY / TILE_SIZE);

      if (this.wallTiles.has(`${tileCol},${tileRow}`)) {
        // Try sliding along walls
        const curCol = Math.floor(this.player.x / TILE_SIZE);
        const curRow = Math.floor(this.player.y / TILE_SIZE);
        const hCol = Math.floor(nextX / TILE_SIZE);
        if (vx !== 0 && this.wallTiles.has(`${hCol},${curRow}`)) vx = 0;
        const vRow = Math.floor(nextY / TILE_SIZE);
        if (vy !== 0 && this.wallTiles.has(`${curCol},${vRow}`)) vy = 0;
      }
    }

    this.player.body.setVelocity(vx, vy);

    // Check if player is in a bush (hidden)
    const playerCol = Math.floor(this.player.x / TILE_SIZE);
    const playerRow = Math.floor(this.player.y / TILE_SIZE);
    if (playerRow >= 0 && playerRow < MAP_ROWS && playerCol >= 0 && playerCol < MAP_COLS) {
      const onBush = ZOO_MAP[playerRow][playerCol] === TILE.BUSH;
      if (onBush && this.isHidden) {
        this.player.setAlpha(0.5);
      } else {
        this.isHidden = false;
        this.player.setAlpha(1);
      }
    }
  }

  toggleHide() {
    const playerCol = Math.floor(this.player.x / TILE_SIZE);
    const playerRow = Math.floor(this.player.y / TILE_SIZE);
    if (playerRow >= 0 && playerRow < MAP_ROWS && playerCol >= 0 && playerCol < MAP_COLS) {
      if (ZOO_MAP[playerRow][playerCol] === TILE.BUSH) {
        this.isHidden = !this.isHidden;
        this.player.setAlpha(this.isHidden ? 0.4 : 1);
        if (this.isHidden) {
          this.hud.showNotification('Hidden in bush!', 1000);
        }
      }
    }
  }

  hasLineOfSight(x1, y1, x2, y2) {
    // Bresenham's line: walk tile-by-tile from (x1,y1) to (x2,y2),
    // return false if any wall/fence/exhibit tile blocks the path.
    let c0 = Math.floor(x1 / TILE_SIZE);
    let r0 = Math.floor(y1 / TILE_SIZE);
    const c1 = Math.floor(x2 / TILE_SIZE);
    const r1 = Math.floor(y2 / TILE_SIZE);

    const dc = Math.abs(c1 - c0);
    const dr = Math.abs(r1 - r0);
    const sc = c0 < c1 ? 1 : -1;
    const sr = r0 < r1 ? 1 : -1;
    let err = dc - dr;

    while (true) {
      // Skip start tile (guard's own tile)
      if (c0 !== Math.floor(x1 / TILE_SIZE) || r0 !== Math.floor(y1 / TILE_SIZE)) {
        if (this.wallTiles.has(`${c0},${r0}`)) return false;
      }
      if (c0 === c1 && r0 === r1) break;
      const e2 = 2 * err;
      if (e2 > -dr) { err -= dr; c0 += sc; }
      if (e2 < dc) { err += dc; r0 += sr; }
    }
    return true;
  }

  updateGuards(delta) {
    this.isSpotted = false;
    let anyChasing = false;
    const dt = delta / 1000; // seconds

    for (const guard of this.guards) {
      if (!guard.active) continue;

      const visionRange = guard.getData('visionRange');
      const alertLevel = guard.getData('alertLevel');
      const baseSpeed = guard.getData('speed');

      const dist = Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y);
      const angleToPlayer = Phaser.Math.Angle.Between(guard.x, guard.y, this.player.x, this.player.y);
      const canSee = dist < visionRange && !this.isHidden &&
        this.hasLineOfSight(guard.x, guard.y, this.player.x, this.player.y);

      // --- PATROL (alertLevel 0) ---
      if (alertLevel === 0) {
        this.updatePatrolMovement(guard, dt);

        if (canSee) {
          this.isSpotted = true;
          guard.setData('alertLevel', 1);
          guard.setData('suspicionTimer', 0);

          const q = this.add.text(guard.x, guard.y - 30, '?!', {
            fontSize: '22px', fontFamily: 'monospace', color: '#FFFF00', fontStyle: 'bold',
          }).setDepth(700).setOrigin(0.5);
          this.tweens.add({ targets: q, y: '-=10', alpha: 0, duration: 800, onComplete: () => q.destroy() });

          // Jolt — camera nudge to signal danger
          this.cameras.main.shake(150, 0.004);
        }
      }

      // --- SUSPICIOUS (alertLevel 1) ---
      else if (alertLevel === 1) {
        if (canSee) {
          this.isSpotted = true;
          let suspicion = guard.getData('suspicionTimer') || 0;
          // Closer = suspicion builds MUCH faster (2x at point blank, 1x at edge)
          const proximityFactor = 1 + (1 - dist / visionRange);
          suspicion += dt * proximityFactor;
          guard.setData('suspicionTimer', suspicion);

          // Close in on the player — fast enough to pressure
          const suspiciousSpeed = baseSpeed * 1.0;
          const sdx = Math.cos(angleToPlayer) * suspiciousSpeed * dt;
          const sdy = Math.sin(angleToPlayer) * suspiciousSpeed * dt;
          this.tryMoveGuard(guard, sdx, sdy);
          guard.setData('facingAngle', angleToPlayer);
          guard.setData('lastKnownPlayerPos', { x: this.player.x, y: this.player.y });

          if (suspicion > 0.8) {
            // Escalate to chase!
            guard.setData('alertLevel', 2);
            guard.setData('chaseTimer', 0);

            const alert = this.add.image(guard.x, guard.y - 30, 'alert').setDepth(700);
            this.tweens.add({ targets: alert, y: '-=15', duration: 250, yoyo: true, onComplete: () => alert.destroy() });
            this.cameras.main.flash(150, 255, 0, 0);
            this.cameras.main.shake(200, 0.008);
          }
        } else {
          // Lost sight — suspicion decays slowly
          let suspicion = guard.getData('suspicionTimer') || 0;
          suspicion -= dt * 0.3;
          if (suspicion <= 0) {
            this.returnToPatrol(guard);
          } else {
            guard.setData('suspicionTimer', suspicion);
            // Move toward last known position aggressively
            const lastPos = guard.getData('lastKnownPlayerPos');
            if (lastPos) {
              const angleTo = Phaser.Math.Angle.Between(guard.x, guard.y, lastPos.x, lastPos.y);
              const ldx = Math.cos(angleTo) * baseSpeed * 0.7 * dt;
              const ldy = Math.sin(angleTo) * baseSpeed * 0.7 * dt;
              this.tryMoveGuard(guard, ldx, ldy);
              guard.setData('facingAngle', angleTo);
            }
          }
        }
      }

      // --- CHASING (alertLevel 2) ---
      else if (alertLevel === 2) {
        anyChasing = true;

        if (canSee) {
          this.isSpotted = true;

          // Chase gets faster over time — starts at 1.8x, ramps to 2.5x
          let chaseTimer = guard.getData('chaseTimer') || 0;
          chaseTimer += dt;
          guard.setData('chaseTimer', chaseTimer);
          const ramp = Math.min(chaseTimer / 3, 1); // 0→1 over 3 seconds
          const chaseSpeed = baseSpeed * (1.8 + ramp * 0.7);

          const cdx = Math.cos(angleToPlayer) * chaseSpeed * dt;
          const cdy = Math.sin(angleToPlayer) * chaseSpeed * dt;
          this.tryMoveGuard(guard, cdx, cdy);
          guard.setData('facingAngle', angleToPlayer);
          guard.setData('lastKnownPlayerPos', { x: this.player.x, y: this.player.y });

          // Periodic camera shake while being chased
          if (Math.floor(chaseTimer * 4) !== Math.floor((chaseTimer - dt) * 4)) {
            this.cameras.main.shake(80, 0.003);
          }

          if (dist < 32) {
            this.getCaught();
          }
        } else {
          // Lost sight — head to last known position, then search
          const lastPos = guard.getData('lastKnownPlayerPos');
          if (lastPos) {
            const distToLast = Phaser.Math.Distance.Between(guard.x, guard.y, lastPos.x, lastPos.y);
            if (distToLast < 20) {
              guard.setData('lostTimer', (guard.getData('lostTimer') || 0) + dt);
              if (guard.getData('lostTimer') > 2.5) {
                guard.setData('lostTimer', 0);
                this.returnToPatrol(guard);
              } else {
                // Spin around looking for player
                guard.setData('facingAngle', guard.getData('facingAngle') + dt * 3);
              }
            } else {
              // Sprint to last known position
              const angleTo = Phaser.Math.Angle.Between(guard.x, guard.y, lastPos.x, lastPos.y);
              const spdx = Math.cos(angleTo) * baseSpeed * 1.5 * dt;
              const spdy = Math.sin(angleTo) * baseSpeed * 1.5 * dt;
              this.tryMoveGuard(guard, spdx, spdy);
              guard.setData('facingAngle', angleTo);
            }
          } else {
            this.returnToPatrol(guard);
          }
        }
      }

      // Clamp guard to zone bounds
      const zoneMaxY = this.levelConfig.zone.maxRow * TILE_SIZE;
      guard.x = Phaser.Math.Clamp(guard.x, TILE_SIZE, (MAP_COLS - 1) * TILE_SIZE);
      guard.y = Phaser.Math.Clamp(guard.y, TILE_SIZE, zoneMaxY);
    }

    // Danger vignette — red tint overlay that pulses during chase
    this.updateDangerOverlay(anyChasing, dt);
  }

  updateFlashlights() {
    const time = this.time.now;
    for (const guard of this.guards) {
      const flashlight = guard.getData('flashlight');
      if (!flashlight) continue;

      flashlight.setPosition(guard.x, guard.y);

      const facingAngle = guard.getData('facingAngle') || 0;
      flashlight.setRotation(facingAngle - Math.PI / 2);

      const alertLevel = guard.getData('alertLevel');
      if (alertLevel === 2) {
        // Chasing — angry red, pulsing intensity
        flashlight.setTint(0xFF2222);
        flashlight.setAlpha(0.7 + Math.sin(time * 0.01) * 0.25);
        flashlight.setScale(1.3 + Math.sin(time * 0.008) * 0.15);
      } else if (alertLevel === 1) {
        // Suspicious — warning yellow, flickering
        flashlight.setTint(0xFFCC00);
        flashlight.setAlpha(0.65 + Math.sin(time * 0.006) * 0.15);
        flashlight.setScale(1.1);
      } else {
        flashlight.clearTint();
        flashlight.setAlpha(0.5);
        flashlight.setScale(1);
      }
    }
  }

  updateDangerOverlay(anyChasing, dt) {
    // Create overlay on first use
    if (!this.dangerOverlay) {
      this.dangerOverlay = this.add.graphics().setDepth(990).setScrollFactor(0).setAlpha(0);
    }

    if (anyChasing) {
      this.dangerAlpha = Math.min((this.dangerAlpha || 0) + dt * 2, 1);
    } else {
      this.dangerAlpha = Math.max((this.dangerAlpha || 0) - dt * 3, 0);
    }

    if (this.dangerAlpha > 0) {
      const w = this.cameras.main.width;
      const h = this.cameras.main.height;
      const pulse = 0.08 + Math.sin(this.time.now * 0.005) * 0.04;
      this.dangerOverlay.clear();
      this.dangerOverlay.setAlpha(this.dangerAlpha);
      // Red vignette edges
      this.dangerOverlay.fillStyle(0xFF0000, pulse);
      this.dangerOverlay.fillRect(0, 0, w, 25);
      this.dangerOverlay.fillRect(0, h - 25, w, 25);
      this.dangerOverlay.fillRect(0, 0, 25, h);
      this.dangerOverlay.fillRect(w - 25, 0, 25, h);
      // Corners thicker
      this.dangerOverlay.fillStyle(0xFF0000, pulse * 1.5);
      this.dangerOverlay.fillRect(0, 0, 60, 40);
      this.dangerOverlay.fillRect(w - 60, 0, 60, 40);
      this.dangerOverlay.fillRect(0, h - 40, 60, 40);
      this.dangerOverlay.fillRect(w - 60, h - 40, 60, 40);
    } else {
      this.dangerOverlay.clear();
    }
  }

  checkProximity(delta) {
    let nearInteractable = null;
    let nearType = null;

    // Check NPC proximity
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < 50) {
        nearInteractable = npc;
        nearType = 'npc';
        break;
      }
    }

    // Check giant chest proximity
    if (!nearInteractable && this.giantChest && this.giantChest.active) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.giantChest.x, this.giantChest.y);
      if (dist < 50) {
        nearInteractable = this.giantChest;
        nearType = 'giant_chest';
      }
    }

    // Check chest proximity
    if (!nearInteractable) {
      for (const chest of this.chests) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, chest.x, chest.y);
        if (dist < 40) {
          nearInteractable = chest;
          nearType = 'chest';
          break;
        }
      }
    }

    // Check mission proximity
    if (!nearInteractable) {
      for (const marker of this.missionMarkers) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, marker.x, marker.y);
        if (dist < 50) {
          nearInteractable = marker;
          nearType = 'mission';
          break;
        }
      }
    }

    // Show/hide interact prompt
    if (nearInteractable) {
      this.interactPrompt.setPosition(nearInteractable.x, nearInteractable.y - 30);
      this.interactPrompt.setVisible(true);
      if (nearType === 'mission') {
        const marker = nearInteractable;
        const progress = marker.getData('progress') || 0;
        const required = marker.getData('required');
        const pct = Math.min(progress / required, 1);
        if (pct > 0) {
          this.interactPrompt.setText(`[Hold SPACE] ${Math.floor(pct * 100)}%`);
        } else {
          this.interactPrompt.setText('[Hold SPACE] Do mischief');
        }
      } else if (nearType === 'giant_chest') {
        this.interactPrompt.setText('[SPACE] Open Giant Chest!');
      } else if (nearType === 'chest') {
        this.interactPrompt.setText('[SPACE] Open');
      } else {
        this.interactPrompt.setText('[SPACE] Talk');
      }
    } else {
      this.interactPrompt.setVisible(false);
    }

    this.nearInteractable = nearInteractable;
    this.nearType = nearType;

    // Auto-progress missions while SPACE/action is held (use real delta)
    const actionHeld = this.actionKey.isDown || (this.touch && this.touch.isActionDown);
    if (nearType === 'mission' && actionHeld) {
      const marker = nearInteractable;
      let progress = marker.getData('progress') || 0;
      progress += delta / 1000; // delta is in ms, convert to seconds
      marker.setData('progress', progress);

      const required = marker.getData('required');
      const pct = Math.min(progress / required, 1);

      // Visual feedback: scale up + change color toward green
      marker.setScale(1.2 + pct * 0.3);
      marker.setTint(Phaser.Display.Color.GetColor(
        Math.floor(255 - pct * 200),
        Math.floor(107 + pct * 148),
        Math.floor(107 - pct * 50)
      ));

      // Draw a progress bar above the marker
      if (!this.progressBar) {
        this.progressBar = this.add.graphics().setDepth(800);
      }
      this.progressBar.clear();
      const barW = 40;
      const barH = 6;
      const barX = marker.x - barW / 2;
      const barY = marker.y - 28;
      // Background
      this.progressBar.fillStyle(0x000000, 0.7);
      this.progressBar.fillRoundedRect(barX, barY, barW, barH, 2);
      // Fill
      this.progressBar.fillStyle(0x33FF33, 0.9);
      this.progressBar.fillRoundedRect(barX, barY, barW * pct, barH, 2);

      if (progress >= required) {
        this.progressBar.clear();
        this.completeMission(marker);
      }
    } else {
      // Hide progress bar when not holding E on a mission
      if (this.progressBar) {
        this.progressBar.clear();
      }
    }
  }

  handleAction() {
    if (this.dialogBox.isOpen) return;

    // Priority 1: interact with nearby NPC, chest, or giant chest
    if (this.nearInteractable) {
      if (this.nearType === 'npc') {
        this.interactWithNPC(this.nearInteractable);
        return;
      } else if (this.nearType === 'giant_chest') {
        this.openGiantChest();
        return;
      } else if (this.nearType === 'chest') {
        this.openChest(this.nearInteractable);
        return;
      }
      // Missions handled by hold-check in checkProximity
      if (this.nearType === 'mission') return;
    }

    // Priority 2: hide in bush if standing on one
    this.toggleHide();
  }

  interactWithNPC(npc) {
    const key = npc.getData('animalKey');
    const data = npc.getData('animalData');
    const dialogues = DIALOGUES[key];

    if (!dialogues || dialogues.length === 0) return;

    const dialog = Phaser.Utils.Array.GetRandom(dialogues);

    this.dialogBox.show(data.name, dialog.text, dialog.choices, (choiceIndex) => {
      // Allegiance was randomized at spawn — player doesn't know until they pick
      if (data.type === 'friendly' && choiceIndex === 0) {
        this.handleFriendlyHelp(data, npc);
      } else if (data.type === 'saboteur' && choiceIndex === 0) {
        this.handleSabotage(data, key, choiceIndex);
      }
      npc.setData('talked', true);
    });
  }

  handleFriendlyHelp(data, npc) {
    switch (data.helpType) {
      case 'hints':
        // Briefly reveal guard positions on minimap (visual hint)
        for (const guard of this.guards) {
          const arrow = this.add.text(guard.x, guard.y - 35, '👮', { fontSize: '14px' })
            .setDepth(900);
          this.tweens.add({
            targets: arrow,
            alpha: 0,
            duration: 3000,
            onComplete: () => arrow.destroy(),
          });
        }
        this.hud.showNotification('Guard positions revealed!', 2000);
        break;
      case 'distraction':
        // Distract nearest guard — send them to investigate the NPC
        const nearest = this.findNearestGuard(npc.x, npc.y);
        if (nearest) {
          nearest.setData('alertLevel', 0);
          nearest.setData('suspicionTimer', 0);
          // Temporarily set a patrol target near the NPC
          nearest.setData('patrolTarget', { x: npc.x + 50, y: npc.y });
          nearest.setData('patrolPaused', false);
          // After reaching it, pause then resume normal patrol
          this.time.delayedCall(5000, () => {
            if (nearest.active) this.moveGuardToNext(nearest);
          });
          this.hud.showNotification('Guard distracted!', 2000);
        }
        break;
      case 'diversion':
        // Slow all guards for 5 seconds
        for (const guard of this.guards) {
          const origSpeed = guard.getData('speed');
          guard.setData('speed', origSpeed * 0.5);
          this.time.delayedCall(5000, () => {
            if (guard.active) guard.setData('speed', origSpeed);
          });
        }
        this.hud.showNotification('Guards slowed!', 2000);
        break;
      case 'warning':
        // Increase vision range briefly (shows guards through walls)
        this.cameras.main.setZoom(1.2);
        this.time.delayedCall(3000, () => this.cameras.main.setZoom(1.5));
        this.hud.showNotification('Enhanced awareness!', 2000);
        break;
    }
  }

  handleSabotage(data, key, choiceIndex) {
    const name = data.name.split(' ')[0];

    switch (data.sabotageType) {
      case 'misdirect':
        // Send a guard straight at the player
        const nearest = this.findNearestGuard(this.player.x, this.player.y);
        if (nearest) {
          nearest.setData('alertLevel', 2);
          nearest.setData('lastKnownPlayerPos', { x: this.player.x, y: this.player.y });
          nearest.setData('chaseTimer', 0);
          const moveTween = nearest.getData('moveTween');
          if (moveTween && moveTween.isPlaying) moveTween.stop();
        }
        this.hud.showNotification(`${name} sold you out!`, 2000);
        break;
      case 'alert':
        // Alert nearest guard after a delay (sneaky)
        this.time.delayedCall(2000, () => {
          const g = this.findNearestGuard(this.player.x, this.player.y);
          if (g) {
            g.setData('alertLevel', 1);
            g.setData('suspicionTimer', 0.5);
            g.setData('lastKnownPlayerPos', { x: this.player.x, y: this.player.y });
          }
          this.hud.showNotification(`${name} tipped off a guard!`, 2000);
        });
        break;
      case 'noise':
        // Alert all nearby guards
        for (const guard of this.guards) {
          const dist = Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y);
          if (dist < 250) {
            guard.setData('alertLevel', 1);
            guard.setData('suspicionTimer', 0.6);
          }
        }
        this.hud.showNotification(`${name} made a scene!`, 2000);
        break;
    }
  }

  findNearestGuard(x, y) {
    let nearest = null;
    let minDist = Infinity;
    for (const guard of this.guards) {
      const dist = Phaser.Math.Distance.Between(x, y, guard.x, guard.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = guard;
      }
    }
    return nearest;
  }

  openChest(chest) {
    const product = chest.getData('product');
    const sparkle = chest.getData('sparkle');

    // Add product to inventory
    this.gameState.products.push(product.id);
    this.gameState.score += 50;

    // Show notification
    this.hud.showNotification(`${product.emoji} Found ${product.name}!\n${product.desc}`, 3000);

    // Remove chest with animation
    this.tweens.add({
      targets: [chest, sparkle],
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      ease: 'Back.easeIn',
      onComplete: () => {
        chest.destroy();
        if (sparkle) sparkle.destroy();
      },
    });

    // Add beauty overlay to player immediately
    const overlay = this.add.image(this.player.x, this.player.y, 'beauty_' + product.id)
      .setDepth(601).setScale(0.9);
    this.beautyOverlays.push(overlay);

    // Sparkle particles around player
    for (let i = 0; i < 8; i++) {
      const s = this.add.image(
        this.player.x + (Math.random() - 0.5) * 40,
        this.player.y + (Math.random() - 0.5) * 40,
        'sparkle'
      ).setDepth(700).setScale(0.5 + Math.random());
      this.tweens.add({
        targets: s,
        y: '-=20',
        alpha: 0,
        scale: 0,
        duration: 800 + Math.random() * 400,
        onComplete: () => s.destroy(),
      });
    }

    // Remove from chests array
    const idx = this.chests.indexOf(chest);
    if (idx > -1) this.chests.splice(idx, 1);

    // When all chests collected and no special item yet, chance to spawn giant chest
    if (this.chests.length === 0 && !this.giantChest && !this.gameState.specialItem && Math.random() < 0.6) {
      this.time.delayedCall(1000, () => this.spawnGiantChest());
    }
  }

  spawnGiantChest() {
    const walkable = this.getWalkableTiles();
    const positions = this.pickSpreadPositions(1, walkable, 5);
    if (positions.length === 0) return;
    const pos = positions[0];

    const x = pos.x * TILE_SIZE + TILE_SIZE / 2;
    const y = pos.y * TILE_SIZE + TILE_SIZE / 2;

    this.giantChest = this.add.image(x, y, 'giant_chest')
      .setDepth(555).setScale(0);

    // Dramatic entrance
    this.tweens.add({
      targets: this.giantChest,
      scale: 1.5,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // Golden glow ring
    const glow = this.add.graphics().setDepth(554);
    this.giantChest.setData('glow', glow);
    let glowPhase = 0;
    this.giantChest.setData('glowTimer', this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (!this.giantChest || !this.giantChest.active) return;
        glowPhase += 0.1;
        glow.clear();
        const alpha = 0.15 + Math.sin(glowPhase) * 0.1;
        const radius = 30 + Math.sin(glowPhase * 0.7) * 5;
        glow.fillStyle(0xFFD700, alpha);
        glow.fillCircle(this.giantChest.x, this.giantChest.y, radius);
      },
    }));

    // Sparkle ring
    const sparkle = this.add.image(x, y - 20, 'sparkle').setDepth(556).setAlpha(0);
    this.tweens.add({
      targets: sparkle,
      alpha: 1, scaleX: 2, scaleY: 2,
      duration: 500, yoyo: true, repeat: -1,
    });
    this.giantChest.setData('sparkle', sparkle);

    this.hud.showNotification('A giant chest appeared!', 3000);
    this.cameras.main.shake(300, 0.005);
  }

  openGiantChest() {
    if (!this.giantChest) return;

    // Pick 2 random items + always include lion costume
    const shuffled = Phaser.Utils.Array.Shuffle([...SPECIAL_ITEMS]);
    const lionItem = shuffled.find(i => i.id === 'lion_costume');
    const others = shuffled.filter(i => i.id !== 'lion_costume').slice(0, 1);
    const choices = Phaser.Utils.Array.Shuffle([lionItem, ...others]);

    const choiceTexts = choices.map(c => `${c.emoji} ${c.name}`);

    this.dialogBox.show('Giant Chest', 'Choose a special item!', choiceTexts, (choiceIndex) => {
      const chosen = choices[choiceIndex];
      this.gameState.specialItem = chosen.id;
      this.gameState.score += 100;

      this.hud.showNotification(`${chosen.emoji} ${chosen.name}!\n${chosen.desc}`, 4000);

      // Add overlay to player
      const overlay = this.add.image(this.player.x, this.player.y, 'special_' + chosen.id)
        .setDepth(602).setScale(0.9);
      this.beautyOverlays.push(overlay);

      // Clean up giant chest
      const glow = this.giantChest.getData('glow');
      const sparkle = this.giantChest.getData('sparkle');
      const glowTimer = this.giantChest.getData('glowTimer');
      if (glowTimer) glowTimer.destroy();

      // Dramatic open animation
      this.tweens.add({
        targets: [this.giantChest, sparkle],
        scaleX: 2.5, scaleY: 2.5, alpha: 0,
        duration: 800, ease: 'Back.easeIn',
        onComplete: () => {
          this.giantChest.destroy();
          if (sparkle) sparkle.destroy();
          if (glow) glow.destroy();
          this.giantChest = null;
        },
      });

      // Big sparkle explosion
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 30 + Math.random() * 20;
        const s = this.add.image(
          this.player.x + Math.cos(angle) * dist,
          this.player.y + Math.sin(angle) * dist,
          'sparkle'
        ).setDepth(700).setScale(1 + Math.random());
        this.tweens.add({
          targets: s,
          x: s.x + Math.cos(angle) * 30,
          y: s.y + Math.sin(angle) * 30 - 20,
          alpha: 0, scale: 0,
          duration: 800 + Math.random() * 400,
          onComplete: () => s.destroy(),
        });
      }
    });
  }

  completeMission(marker) {
    const mission = marker.getData('mission');
    this.completedMissions.push(mission.id);
    // Also track globally across nights
    if (!this.gameState.completedMissions.includes(mission.id)) {
      this.gameState.completedMissions.push(mission.id);
    }
    this.gameState.score += mission.points;

    this.hud.showNotification(`Mischief Complete!\n${mission.name} (+${mission.points})`, 3000);

    // Celebration effect
    this.tweens.add({
      targets: marker,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      rotation: Math.PI * 2,
      duration: 800,
      onComplete: () => marker.destroy(),
    });

    // Remove from markers array
    const idx = this.missionMarkers.indexOf(marker);
    if (idx > -1) this.missionMarkers.splice(idx, 1);

    this.updateMissionHUD();

    // Check if all missions complete
    if (this.completedMissions.length >= this.levelConfig.missions.length) {
      this.nightComplete();
    }
  }

  updateMissionHUD() {
    const total = this.levelConfig.missions.length;
    const done = this.completedMissions.length;
    const current = this.levelConfig.missions.find(m => !this.completedMissions.includes(m));
    const mission = current ? MISSIONS.find(m => m.id === current) : null;

    if (mission) {
      this.hud.updateMission(`[${done}/${total}] ${mission.name}`);
    } else {
      this.hud.updateMission(`[${done}/${total}] All complete!`);
    }
  }

  getCaught() {
    if (this.isCaught || this.transitioning) return;
    this.isCaught = true;

    this.gameState.lives--;
    this.hud.updateLives(this.gameState.lives);

    // Stop all guards
    for (const guard of this.guards) {
      const tween = guard.getData('moveTween');
      if (tween) tween.stop();
    }

    // Flash screen
    this.cameras.main.shake(300, 0.02);
    this.cameras.main.flash(500, 255, 0, 0);

    // Show caught message
    const caughtText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'CAUGHT!',
      {
        fontSize: '36px',
        fontFamily: 'monospace',
        color: '#FF3333',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setScale(1 / this.cameras.main.zoom);

    this.time.delayedCall(1500, () => {
      caughtText.destroy();

      if (this.gameState.lives <= 0) {
        // Game over
        this.fadeOutMusic();
        let done = false;
        this.cameras.main.fadeOut(800, 0, 0, 0, (_cam, progress) => {
          if (progress >= 1 && !done) {
            done = true;
            this.cleanup();
            this.scene.start('GameOverScene', this.gameState);
          }
        });
      } else {
        // Reset position and continue
        this.player.setPosition(20 * TILE_SIZE + 16, 6 * TILE_SIZE + 16);
        this.isCaught = false;
        this.isSpotted = false;

        // Reset guards to random patrol positions, far from the player
        const minSafeDist = 200;
        for (const guard of this.guards) {
          const patrol = guard.getData('patrol');
          // Try to find a waypoint far from the player
          let bestIdx = 0;
          let bestDist = 0;
          for (let j = 0; j < patrol.length; j++) {
            const px = patrol[j].x * TILE_SIZE + TILE_SIZE / 2;
            const py = patrol[j].y * TILE_SIZE + TILE_SIZE / 2;
            const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, px, py);
            if (d > bestDist) {
              bestDist = d;
              bestIdx = j;
            }
          }
          // Fallback: if even the best waypoint is too close, just pick it anyway
          const pos = patrol[bestIdx];
          guard.setPosition(pos.x * TILE_SIZE + TILE_SIZE / 2, pos.y * TILE_SIZE + TILE_SIZE / 2);
          guard.setData('patrolIndex', bestIdx);
          guard.setData('lostTimer', 0);
          this.returnToPatrol(guard);
        }

        this.hud.showNotification(`Sent back! ${this.gameState.lives} ${this.gameState.lives === 1 ? 'life' : 'lives'} left`, 2000);
      }
    });
  }

  nightComplete() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.timerEvent.destroy();
    this.fadeOutMusic();

    // Celebration
    const completeText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 20,
      'Night Complete!',
      {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: '#33FF33',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setScale(1 / this.cameras.main.zoom);

    const scoreText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 20,
      `Score: ${this.gameState.score}`,
      {
        fontSize: '18px',
        fontFamily: 'monospace',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 3,
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setScale(1 / this.cameras.main.zoom);

    // Sparkle celebration
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const s = this.add.image(
          this.player.x + (Math.random() - 0.5) * 100,
          this.player.y + (Math.random() - 0.5) * 100,
          'sparkle'
        ).setDepth(900).setScale(0.5 + Math.random() * 1.5);
        this.tweens.add({
          targets: s,
          y: '-=30',
          alpha: 0,
          rotation: Math.PI,
          duration: 1000,
          onComplete: () => s.destroy(),
        });
      });
    }

    this.time.delayedCall(3000, () => {
      let done = false;
      this.cameras.main.fadeOut(800, 0, 0, 0, (_cam, progress) => {
        if (progress >= 1 && !done) {
          done = true;
          this.cleanup();
          const nextNight = this.gameState.night + 1;
          if (nextNight > LEVELS.length) {
            this.scene.start('GameOverScene', { ...this.gameState, won: true });
          } else {
            this.scene.start('HabitatScene', {
              ...this.gameState,
              night: nextNight,
            });
          }
        }
      });
    });
  }

  tickTimer() {
    if (this.transitioning) return;
    this.timeRemaining--;
    if (this.timeRemaining <= 0) {
      this.transitioning = true;
      this.timerEvent.destroy();
      this.fadeOutMusic();
      // Time's up - dawn is breaking, forced back to habitat
      this.hud.showNotification('Dawn is breaking! Time to get back!', 2000);
      this.time.delayedCall(2000, () => {
        let done = false;
        this.cameras.main.fadeOut(800, 255, 200, 100, (_cam, progress) => {
          if (progress >= 1 && !done) {
            done = true;
            this.cleanup();
            // Lose a life for not completing missions
            this.gameState.lives--;
            if (this.gameState.lives <= 0) {
              this.scene.start('GameOverScene', this.gameState);
            } else {
              this.scene.start('HabitatScene', this.gameState);
            }
          }
        });
      });
    }
  }

  checkCollisions() {
    // Additional collision check with guards (physics-based)
    for (const guard of this.guards) {
      if (!guard.active) continue;
      const dist = Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y);
      if (dist < 25 && !this.isHidden) {
        this.getCaught();
      }
    }
  }

  updateBeautyOverlays() {
    for (const overlay of this.beautyOverlays) {
      overlay.setPosition(this.player.x, this.player.y);
    }
  }

  fadeOutMusic() {
    if (this.nightMusic) {
      this.tweens.add({
        targets: this.nightMusic,
        volume: 0,
        duration: 2000,
        onComplete: () => this.nightMusic.stop(),
      });
    }
  }

  cleanup() {
    if (this.nightMusic) { this.nightMusic.stop(); this.nightMusic = null; }
    if (this.timerEvent) { this.timerEvent.destroy(); this.timerEvent = null; }
    if (this.hud) { this.hud.destroy(); this.hud = null; }
    if (this.dialogBox) { this.dialogBox.destroy(); this.dialogBox = null; }
    if (this.touch) { this.touch.destroy(); this.touch = null; }
  }
}
