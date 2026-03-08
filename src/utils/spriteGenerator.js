// Programmatic sprite generation using Phaser Graphics
// All game art is created here - no external assets needed!

const TILE_SIZE = 32;

export function generateSprites(scene) {
  generateTileSprites(scene);
  generateGiraffeSprite(scene);
  generateGuardSprite(scene);
  generateAnimalSprites(scene);
  generateChestSprite(scene);
  generateGiantChestSprite(scene);
  generateMissionMarker(scene);
  generateParticles(scene);
  generateUISprites(scene);
}

function generateTileSprites(scene) {
  const T = TILE_SIZE;

  // Grass tile
  let g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x2d5a1e);
  g.fillRect(0, 0, T, T);
  // Grass detail
  g.fillStyle(0x3a7a28);
  for (let i = 0; i < 6; i++) {
    const gx = Math.floor(Math.random() * (T - 4)) + 2;
    const gy = Math.floor(Math.random() * (T - 4)) + 2;
    g.fillRect(gx, gy, 2, 4);
  }
  g.generateTexture('tile_grass', T, T);
  g.destroy();

  // Path tile
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xc4a46c);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0xb89860);
  g.fillRect(2, 2, 4, 4);
  g.fillRect(14, 10, 5, 3);
  g.fillRect(24, 20, 3, 4);
  g.generateTexture('tile_path', T, T);
  g.destroy();

  // Wall tile
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x666666);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0x777777);
  g.fillRect(1, 1, 14, 14);
  g.fillRect(17, 1, 14, 14);
  g.fillRect(1, 17, 14, 14);
  g.fillRect(17, 17, 14, 14);
  g.fillStyle(0x555555);
  g.fillRect(0, 15, T, 2);
  g.fillRect(15, 0, 2, T);
  g.generateTexture('tile_wall', T, T);
  g.destroy();

  // Fence tile
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x2d5a1e);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0x4a3728);
  g.fillRect(2, 0, 4, T);
  g.fillRect(T - 6, 0, 4, T);
  g.fillRect(0, 8, T, 4);
  g.fillRect(0, 20, T, 4);
  g.fillStyle(0x5a4738);
  g.fillRect(3, 0, 2, T);
  g.fillRect(T - 5, 0, 2, T);
  g.generateTexture('tile_fence', T, T);
  g.destroy();

  // Water tile
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x1a6b8a);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0x2080a0);
  g.fillRect(4, 6, 12, 3);
  g.fillRect(16, 16, 10, 3);
  g.fillStyle(0x60c0e0);
  g.fillRect(6, 7, 6, 1);
  g.fillRect(18, 17, 5, 1);
  g.generateTexture('tile_water', T, T);
  g.destroy();

  // Bush tile (hiding spot!)
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x2d5a1e);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0x1a8a2e);
  g.fillCircle(16, 16, 14);
  g.fillStyle(0x22aa38);
  g.fillCircle(10, 12, 10);
  g.fillCircle(22, 14, 9);
  g.fillCircle(16, 8, 8);
  g.fillStyle(0x2ecc40);
  g.fillCircle(12, 10, 5);
  g.fillCircle(20, 12, 4);
  g.generateTexture('tile_bush', T, T);
  g.destroy();

  // Exhibit tile
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x8B7355);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0x9B8365);
  g.fillRect(2, 2, T - 4, T - 4);
  g.fillStyle(0x7B6345);
  g.fillRect(0, 0, T, 2);
  g.fillRect(0, 0, 2, T);
  g.generateTexture('tile_exhibit', T, T);
  g.destroy();

  // Gate tile
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xc4a46c);
  g.fillRect(0, 0, T, T);
  g.fillStyle(0xDAA520);
  g.fillRect(8, 0, 4, T);
  g.fillRect(20, 0, 4, T);
  g.fillRect(0, 12, T, 4);
  g.fillStyle(0xFFD700);
  g.fillCircle(16, 14, 3);
  g.generateTexture('tile_gate', T, T);
  g.destroy();
}

function generateGiraffeSprite(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const w = 32, h = 48;

  // Body
  g.fillStyle(0xF5C842);
  g.fillRoundedRect(6, 18, 20, 22, 4);

  // Spots
  g.fillStyle(0xC4801A);
  g.fillCircle(12, 24, 3);
  g.fillCircle(20, 28, 3);
  g.fillCircle(16, 34, 2);
  g.fillCircle(24, 22, 2);

  // Neck
  g.fillStyle(0xF5C842);
  g.fillRoundedRect(10, 4, 12, 18, 3);

  // Neck spots
  g.fillStyle(0xC4801A);
  g.fillCircle(14, 8, 2);
  g.fillCircle(18, 12, 2);

  // Head
  g.fillStyle(0xF5C842);
  g.fillCircle(16, 6, 8);

  // Ossicones (little horns)
  g.fillStyle(0xC4801A);
  g.fillRect(11, 0, 3, 6);
  g.fillRect(18, 0, 3, 6);
  g.fillStyle(0xF5C842);
  g.fillCircle(12, 0, 2);
  g.fillCircle(19, 0, 2);

  // Eyes
  g.fillStyle(0x000000);
  g.fillCircle(13, 5, 2);
  g.fillCircle(19, 5, 2);
  g.fillStyle(0xFFFFFF);
  g.fillCircle(13, 4, 1);
  g.fillCircle(19, 4, 1);

  // Smile
  g.lineStyle(1, 0x000000);
  g.beginPath();
  g.arc(16, 8, 3, 0.2, Math.PI - 0.2);
  g.strokePath();

  // Legs
  g.fillStyle(0xF5C842);
  g.fillRect(8, 38, 5, 10);
  g.fillRect(19, 38, 5, 10);

  // Hooves
  g.fillStyle(0x8B6914);
  g.fillRect(8, 44, 5, 4);
  g.fillRect(19, 44, 5, 4);

  g.generateTexture('giraffe', w, h);
  g.destroy();
}

function generateGuardSprite(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const w = 28, h = 36;

  // Body (uniform)
  g.fillStyle(0x1a237e);
  g.fillRoundedRect(4, 12, 20, 18, 3);

  // Badge
  g.fillStyle(0xFFD700);
  g.fillCircle(14, 16, 3);
  g.fillStyle(0xDAA520);
  g.fillCircle(14, 16, 2);

  // Head
  g.fillStyle(0xDEB887);
  g.fillCircle(14, 8, 8);

  // Hat
  g.fillStyle(0x1a237e);
  g.fillRect(4, 0, 20, 6);
  g.fillRect(2, 5, 24, 3);
  g.fillStyle(0xFFD700);
  g.fillRect(6, 6, 16, 1);

  // Eyes
  g.fillStyle(0x000000);
  g.fillCircle(11, 7, 2);
  g.fillCircle(17, 7, 2);

  // Stern mouth
  g.lineStyle(2, 0x000000);
  g.beginPath();
  g.moveTo(10, 12);
  g.lineTo(18, 12);
  g.strokePath();

  // Legs
  g.fillStyle(0x1a237e);
  g.fillRect(6, 28, 6, 8);
  g.fillRect(16, 28, 6, 8);

  // Shoes
  g.fillStyle(0x222222);
  g.fillRect(5, 33, 8, 3);
  g.fillRect(15, 33, 8, 3);

  g.generateTexture('guard', w, h);
  g.destroy();

  // Flashlight cone (tip centered at top of texture)
  const f = scene.make.graphics({ x: 0, y: 0, add: false });
  f.fillStyle(0xFFFF88, 0.15);
  f.beginPath();
  f.moveTo(50, 0);
  f.lineTo(0, 120);
  f.lineTo(100, 120);
  f.closePath();
  f.fillPath();
  f.fillStyle(0xFFFF44, 0.08);
  f.beginPath();
  f.moveTo(50, 0);
  f.lineTo(20, 80);
  f.lineTo(80, 80);
  f.closePath();
  f.fillPath();
  f.generateTexture('flashlight', 100, 120);
  f.destroy();
}

function generateAnimalSprites(scene) {
  // Owl
  let g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x8B6914);
  g.fillCircle(14, 16, 12); // body
  g.fillStyle(0xFFD700);
  g.fillCircle(9, 12, 5); // left eye ring
  g.fillCircle(19, 12, 5); // right eye ring
  g.fillStyle(0x000000);
  g.fillCircle(9, 12, 3); // left eye
  g.fillCircle(19, 12, 3); // right eye
  g.fillStyle(0xFFFFFF);
  g.fillCircle(10, 11, 1);
  g.fillCircle(20, 11, 1);
  g.fillStyle(0xFF8C00);
  g.fillTriangle(14, 14, 11, 18, 17, 18); // beak
  // ear tufts
  g.fillStyle(0x8B6914);
  g.fillTriangle(4, 6, 7, 2, 10, 8);
  g.fillTriangle(24, 6, 21, 2, 18, 8);
  g.generateTexture('animal_owl', 28, 28);
  g.destroy();

  // Monkey
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x8B4513);
  g.fillCircle(14, 14, 12);
  g.fillStyle(0xFFD39B);
  g.fillCircle(14, 16, 8); // face
  g.fillStyle(0x8B4513);
  g.fillCircle(3, 12, 5); // ear
  g.fillCircle(25, 12, 5);
  g.fillStyle(0xFFD39B);
  g.fillCircle(3, 12, 3);
  g.fillCircle(25, 12, 3);
  g.fillStyle(0x000000);
  g.fillCircle(10, 12, 2);
  g.fillCircle(18, 12, 2);
  g.fillStyle(0xFFFFFF);
  g.fillCircle(10, 11, 1);
  g.fillCircle(18, 11, 1);
  g.lineStyle(1, 0x000000);
  g.beginPath();
  g.arc(14, 16, 4, 0.2, Math.PI - 0.2);
  g.strokePath();
  g.generateTexture('animal_monkey', 28, 28);
  g.destroy();

  // Penguin
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x2F2F2F);
  g.fillCircle(14, 16, 12);
  g.fillStyle(0xFFFFFF);
  g.fillEllipse(14, 18, 14, 16); // belly
  g.fillStyle(0x2F2F2F);
  g.fillCircle(14, 8, 8); // head
  g.fillStyle(0xFFFFFF);
  g.fillCircle(10, 7, 3);
  g.fillCircle(18, 7, 3);
  g.fillStyle(0x000000);
  g.fillCircle(10, 7, 2);
  g.fillCircle(18, 7, 2);
  g.fillStyle(0xFF8C00);
  g.fillTriangle(14, 9, 11, 13, 17, 13); // beak
  g.generateTexture('animal_penguin', 28, 28);
  g.destroy();

  // Parrot
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xFF3333);
  g.fillCircle(14, 14, 12);
  g.fillStyle(0x33FF33);
  g.fillCircle(14, 20, 8); // wing
  g.fillStyle(0x3333FF);
  g.fillCircle(14, 24, 5); // tail
  g.fillStyle(0xFF3333);
  g.fillCircle(14, 8, 8); // head
  g.fillStyle(0xFFFFFF);
  g.fillCircle(10, 7, 3);
  g.fillCircle(18, 7, 3);
  g.fillStyle(0x000000);
  g.fillCircle(10, 7, 2);
  g.fillCircle(18, 7, 2);
  g.fillStyle(0xFFD700);
  g.fillTriangle(14, 9, 10, 14, 14, 14); // beak
  g.generateTexture('animal_parrot', 28, 28);
  g.destroy();

  // Snake
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x228B22);
  g.fillCircle(14, 10, 7); // head
  g.fillStyle(0x90EE90);
  g.fillCircle(14, 14, 4); // chin
  g.fillStyle(0x228B22);
  // coiled body
  g.lineStyle(5, 0x228B22);
  g.beginPath();
  g.arc(14, 20, 6, 0, Math.PI * 2);
  g.strokePath();
  g.fillStyle(0xFF0000);
  g.fillCircle(11, 8, 2); // eyes
  g.fillCircle(17, 8, 2);
  g.fillStyle(0xFFFF00);
  g.fillCircle(11, 8, 1);
  g.fillCircle(17, 8, 1);
  // tongue
  g.lineStyle(1, 0xFF0000);
  g.beginPath();
  g.moveTo(14, 14);
  g.lineTo(14, 18);
  g.lineTo(12, 20);
  g.moveTo(14, 18);
  g.lineTo(16, 20);
  g.strokePath();
  g.generateTexture('animal_snake', 28, 28);
  g.destroy();

  // Peacock
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  // Tail fan
  g.fillStyle(0x0066CC);
  for (let i = -3; i <= 3; i++) {
    const angle = (i * 0.3);
    const x = 14 + Math.sin(angle) * 10;
    const y = 4 + Math.abs(i) * 2;
    g.fillCircle(x, y, 4);
    g.fillStyle(0x00CCFF);
    g.fillCircle(x, y, 2);
    g.fillStyle(0x0066CC);
  }
  g.fillStyle(0x0044AA);
  g.fillCircle(14, 18, 8); // body
  g.fillCircle(14, 12, 6); // head
  g.fillStyle(0xFFD700);
  g.fillTriangle(14, 14, 11, 18, 17, 18); // beak
  g.fillStyle(0x000000);
  g.fillCircle(11, 11, 2);
  g.fillCircle(17, 11, 2);
  g.fillStyle(0xFFFFFF);
  g.fillCircle(11, 10, 1);
  g.fillCircle(17, 10, 1);
  g.generateTexture('animal_peacock', 28, 28);
  g.destroy();

  // Hyena
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xB8860B);
  g.fillCircle(14, 16, 12);
  g.fillStyle(0x555555);
  g.fillCircle(14, 10, 8); // head
  // spots
  g.fillStyle(0x8B6508);
  g.fillCircle(8, 18, 3);
  g.fillCircle(20, 18, 3);
  g.fillCircle(14, 22, 2);
  // ears
  g.fillStyle(0x555555);
  g.fillTriangle(6, 6, 9, 2, 12, 8);
  g.fillTriangle(22, 6, 19, 2, 16, 8);
  g.fillStyle(0x000000);
  g.fillCircle(11, 9, 2);
  g.fillCircle(17, 9, 2);
  // big grin
  g.lineStyle(2, 0x000000);
  g.beginPath();
  g.arc(14, 12, 5, 0.1, Math.PI - 0.1);
  g.strokePath();
  g.generateTexture('animal_hyena', 28, 28);
  g.destroy();

  // Elephant
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x999999);
  g.fillCircle(14, 16, 14); // big body
  g.fillCircle(14, 8, 10); // head
  // ears
  g.fillStyle(0xBBBBBB);
  g.fillCircle(2, 10, 6);
  g.fillCircle(26, 10, 6);
  g.fillStyle(0x999999);
  // trunk
  g.lineStyle(4, 0x999999);
  g.beginPath();
  g.moveTo(14, 14);
  g.lineTo(14, 22);
  g.lineTo(10, 24);
  g.strokePath();
  g.fillStyle(0x000000);
  g.fillCircle(10, 7, 2);
  g.fillCircle(18, 7, 2);
  g.generateTexture('animal_elephant', 28, 28);
  g.destroy();

  // Flamingo
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xFF69B4);
  g.fillCircle(14, 10, 7); // head
  g.fillStyle(0xFF1493);
  g.fillCircle(14, 18, 8); // body
  g.fillStyle(0xFF69B4);
  // long neck
  g.lineStyle(3, 0xFF69B4);
  g.beginPath();
  g.moveTo(14, 14);
  g.lineTo(14, 10);
  g.strokePath();
  g.fillStyle(0x000000);
  g.fillTriangle(14, 10, 10, 13, 14, 13); // beak
  g.fillCircle(11, 8, 2); // eye
  g.fillCircle(17, 8, 2);
  g.fillStyle(0xFFFFFF);
  g.fillCircle(11, 7, 1);
  g.fillCircle(17, 7, 1);
  // legs
  g.lineStyle(2, 0xFF69B4);
  g.beginPath();
  g.moveTo(12, 24);
  g.lineTo(12, 28);
  g.moveTo(16, 24);
  g.lineTo(16, 28);
  g.strokePath();
  g.generateTexture('animal_flamingo', 28, 28);
  g.destroy();

  // Turtle
  g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x556B2F);
  g.fillEllipse(14, 16, 24, 16); // shell
  g.fillStyle(0x8FBC8F);
  // shell pattern
  g.lineStyle(1, 0x556B2F);
  g.beginPath();
  g.arc(14, 16, 8, 0, Math.PI * 2);
  g.strokePath();
  g.beginPath();
  g.arc(14, 16, 4, 0, Math.PI * 2);
  g.strokePath();
  // head
  g.fillStyle(0x8FBC8F);
  g.fillCircle(24, 14, 5);
  g.fillStyle(0x000000);
  g.fillCircle(25, 13, 1.5);
  g.generateTexture('animal_turtle', 28, 28);
  g.destroy();
}

function generateChestSprite(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  // Chest body
  g.fillStyle(0x8B4513);
  g.fillRoundedRect(2, 8, 24, 16, 2);

  // Chest lid
  g.fillStyle(0xA0522D);
  g.fillRoundedRect(1, 4, 26, 8, 3);

  // Metal bands
  g.fillStyle(0xDAA520);
  g.fillRect(4, 4, 2, 20);
  g.fillRect(22, 4, 2, 20);

  // Lock
  g.fillStyle(0xFFD700);
  g.fillCircle(14, 14, 3);
  g.fillStyle(0xDAA520);
  g.fillCircle(14, 14, 2);

  // Sparkle
  g.fillStyle(0xFFFF00);
  g.fillRect(13, 0, 2, 4);
  g.fillRect(6, 2, 4, 2);
  g.fillRect(18, 2, 4, 2);

  g.generateTexture('chest', 28, 28);
  g.destroy();
}

function generateGiantChestSprite(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const w = 48, h = 48;

  // Glow base
  g.fillStyle(0xFFD700, 0.3);
  g.fillCircle(24, 24, 24);

  // Chest body (bigger)
  g.fillStyle(0x8B4513);
  g.fillRoundedRect(4, 16, 40, 26, 4);

  // Chest lid
  g.fillStyle(0xA0522D);
  g.fillRoundedRect(2, 10, 44, 12, 5);

  // Metal bands
  g.fillStyle(0xFFD700);
  g.fillRect(6, 10, 3, 32);
  g.fillRect(39, 10, 3, 32);
  g.fillRect(2, 20, 44, 3);

  // Big ornate lock
  g.fillStyle(0xFFD700);
  g.fillCircle(24, 28, 6);
  g.fillStyle(0xDAA520);
  g.fillCircle(24, 28, 4);
  g.fillStyle(0xFFD700);
  g.fillCircle(24, 28, 2);

  // Crown on top
  g.fillStyle(0xFFD700);
  g.fillRect(16, 4, 16, 4);
  g.fillTriangle(18, 4, 20, 0, 22, 4);
  g.fillTriangle(22, 4, 24, -2, 26, 4);
  g.fillTriangle(26, 4, 28, 0, 30, 4);

  // Gems
  g.fillStyle(0xFF0066);
  g.fillCircle(24, 1, 2);
  g.fillStyle(0x00CCFF);
  g.fillCircle(20, 2, 1.5);
  g.fillCircle(28, 2, 1.5);

  g.generateTexture('giant_chest', w, h);
  g.destroy();
}

function generateMissionMarker(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  // Star shape for mission marker
  g.fillStyle(0xFF6B6B);
  const cx = 14, cy = 14;
  g.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI / 5) - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = cx + Math.cos(outerAngle) * 12;
    const oy = cy + Math.sin(outerAngle) * 12;
    const ix = cx + Math.cos(innerAngle) * 5;
    const iy = cy + Math.sin(innerAngle) * 5;
    if (i === 0) g.moveTo(ox, oy);
    else g.lineTo(ox, oy);
    g.lineTo(ix, iy);
  }
  g.closePath();
  g.fillPath();

  // Exclamation mark
  g.fillStyle(0xFFFFFF);
  g.fillRect(12, 7, 4, 9);
  g.fillRect(12, 18, 4, 4);

  g.generateTexture('mission_marker', 28, 28);
  g.destroy();
}

function generateParticles(scene) {
  // Sparkle particle
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xFFFF00);
  g.fillRect(3, 0, 2, 8);
  g.fillRect(0, 3, 8, 2);
  g.fillStyle(0xFFFFAA);
  g.fillRect(3, 3, 2, 2);
  g.generateTexture('sparkle', 8, 8);
  g.destroy();

  // Alert particle (!)
  const a = scene.make.graphics({ x: 0, y: 0, add: false });
  a.fillStyle(0xFF0000);
  a.fillCircle(8, 8, 8);
  a.fillStyle(0xFFFFFF);
  a.fillRect(6, 3, 4, 7);
  a.fillRect(6, 12, 4, 3);
  a.generateTexture('alert', 16, 16);
  a.destroy();
}

function generateUISprites(scene) {
  // Heart (for lives)
  const h = scene.make.graphics({ x: 0, y: 0, add: false });
  h.fillStyle(0xFF4444);
  h.fillCircle(7, 6, 6);
  h.fillCircle(17, 6, 6);
  h.fillTriangle(1, 8, 23, 8, 12, 20);
  h.generateTexture('heart', 24, 22);
  h.destroy();

  // Empty heart
  const eh = scene.make.graphics({ x: 0, y: 0, add: false });
  eh.lineStyle(2, 0xFF4444);
  eh.beginPath();
  eh.arc(7, 6, 6, Math.PI, 0);
  eh.arc(17, 6, 6, Math.PI, 0);
  eh.strokePath();
  eh.lineStyle(2, 0xFF4444);
  eh.beginPath();
  eh.moveTo(1, 8);
  eh.lineTo(12, 20);
  eh.lineTo(23, 8);
  eh.strokePath();
  eh.generateTexture('heart_empty', 24, 22);
  eh.destroy();
}

// Generate special item overlay textures for the giraffe
export function generateSpecialItemOverlay(scene, itemId) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const w = 32, h = 48;

  switch (itemId) {
    case 'fanny_pack':
      // Belt
      g.lineStyle(2, 0xFF1493);
      g.beginPath();
      g.moveTo(6, 26);
      g.lineTo(26, 26);
      g.strokePath();
      // Pouch
      g.fillStyle(0xFF69B4);
      g.fillRoundedRect(10, 24, 12, 8, 3);
      g.fillStyle(0xFF1493);
      g.fillRoundedRect(12, 26, 8, 4, 2);
      // Zipper
      g.lineStyle(1, 0xFFD700);
      g.beginPath();
      g.moveTo(13, 28);
      g.lineTo(19, 28);
      g.strokePath();
      break;
    case 'dress':
      // Sparkly ball gown
      g.fillStyle(0x9933FF, 0.7);
      g.beginPath();
      g.moveTo(10, 20);
      g.lineTo(22, 20);
      g.lineTo(26, 40);
      g.lineTo(6, 40);
      g.closePath();
      g.fillPath();
      // Sparkles on dress
      g.fillStyle(0xFFFFFF, 0.8);
      g.fillCircle(12, 28, 1);
      g.fillCircle(20, 32, 1);
      g.fillCircle(16, 25, 1);
      g.fillCircle(14, 35, 1);
      // Neckline
      g.lineStyle(2, 0x9933FF);
      g.beginPath();
      g.moveTo(10, 20);
      g.lineTo(16, 18);
      g.lineTo(22, 20);
      g.strokePath();
      break;
    case 'sword':
      // Foam sword on back
      g.fillStyle(0xAAAAAA);
      g.fillRect(24, 2, 3, 28); // blade
      g.fillStyle(0xCCCCCC);
      g.fillRect(25, 2, 1, 28); // highlight
      // Crossguard
      g.fillStyle(0xDAA520);
      g.fillRect(20, 28, 11, 3);
      // Handle
      g.fillStyle(0x8B4513);
      g.fillRect(24, 31, 3, 6);
      // Pommel
      g.fillStyle(0xDAA520);
      g.fillCircle(25, 38, 2);
      break;
    case 'lion_costume':
      // Mane around head
      g.fillStyle(0xCC8800);
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const mx = 16 + Math.cos(angle) * 11;
        const my = 6 + Math.sin(angle) * 11;
        g.fillCircle(mx, my, 5);
      }
      // Inner mane
      g.fillStyle(0xE6A000);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const mx = 16 + Math.cos(angle) * 9;
        const my = 6 + Math.sin(angle) * 9;
        g.fillCircle(mx, my, 3);
      }
      // Lion nose
      g.fillStyle(0x222222);
      g.fillTriangle(14, 8, 18, 8, 16, 10);
      break;
  }

  g.generateTexture('special_' + itemId, w, h);
  g.destroy();
}

// Generate beauty product overlay textures for the giraffe
export function generateBeautyOverlay(scene, productId) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  const w = 32, h = 48;

  switch (productId) {
    case 'eyeliner':
      g.lineStyle(2, 0x000000);
      g.beginPath();
      g.moveTo(9, 4);
      g.lineTo(7, 3);
      g.moveTo(21, 4);
      g.lineTo(23, 3);
      g.strokePath();
      // Long lashes
      g.lineStyle(1, 0x000000);
      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.moveTo(11 + i * 2, 3);
        g.lineTo(10 + i * 2, 1);
        g.strokePath();
        g.beginPath();
        g.moveTo(17 + i * 2, 3);
        g.lineTo(16 + i * 2, 1);
        g.strokePath();
      }
      break;
    case 'lipstick':
      g.fillStyle(0xCC0033);
      g.beginPath();
      g.arc(16, 8, 3, 0.1, Math.PI - 0.1);
      g.fillPath();
      break;
    case 'blush':
      g.fillStyle(0xFF69B4, 0.4);
      g.fillCircle(10, 7, 3);
      g.fillCircle(22, 7, 3);
      break;
    case 'eyeshadow':
      g.fillStyle(0x9933FF, 0.5);
      g.fillCircle(13, 4, 3);
      g.fillCircle(19, 4, 3);
      break;
    case 'nailpolish':
      g.fillStyle(0xFF1493);
      g.fillRect(8, 44, 5, 4);
      g.fillRect(19, 44, 5, 4);
      break;
    case 'hairbow':
      g.fillStyle(0xFF1493);
      g.fillTriangle(12, 0, 16, 3, 16, 0);
      g.fillTriangle(20, 0, 16, 3, 16, 0);
      g.fillStyle(0xFF69B4);
      g.fillCircle(16, 2, 2);
      break;
    case 'pearls':
      g.fillStyle(0xFFFFF0);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI + 0.2;
        const px = 16 + Math.cos(angle) * 8;
        const py = 15 + Math.sin(angle) * 3;
        g.fillCircle(px, py, 2);
      }
      break;
    case 'sunglasses':
      g.fillStyle(0x111111);
      g.fillCircle(13, 5, 4);
      g.fillCircle(19, 5, 4);
      g.fillRect(13, 4, 6, 2);
      g.fillStyle(0x333366);
      g.fillCircle(13, 5, 3);
      g.fillCircle(19, 5, 3);
      break;
    case 'glitter':
      g.fillStyle(0xFFFF00, 0.6);
      const spots = [[8, 20], [14, 26], [22, 22], [10, 32], [20, 34], [12, 10], [18, 8]];
      for (const [sx, sy] of spots) {
        g.fillRect(sx, sy, 2, 2);
      }
      break;
    case 'tiara':
      g.fillStyle(0xFFD700);
      g.fillRect(8, 0, 16, 2);
      g.fillTriangle(10, 0, 12, -4, 14, 0);
      g.fillTriangle(16, 0, 18, -6, 20, 0);
      g.fillTriangle(22, 0, 24, -4, 26, 0);
      g.fillStyle(0xFF0066);
      g.fillCircle(18, -4, 1.5);
      g.fillStyle(0x00CCFF);
      g.fillCircle(12, -2, 1);
      g.fillCircle(24, -2, 1);
      break;
  }

  g.generateTexture('beauty_' + productId, w, h);
  g.destroy();
}
