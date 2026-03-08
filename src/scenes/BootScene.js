import Phaser from 'phaser';
import { generateSprites, generateBeautyOverlay, generateSpecialItemOverlay } from '../utils/spriteGenerator.js';
import { BEAUTY_PRODUCTS, SPECIAL_ITEMS } from '../data/gameData.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.audio('music_morning', 'music/morning.m4a');
    this.load.audio('music_night', 'music/night.m4a');
    this.load.audio('scare_elephant', 'music/elephant-scare.mp3');
    this.load.audio('scare_piano', 'music/piano-scare.mp3');
    this.load.audio('scare_lion', 'music/lion.mp3');
  }

  create() {
    // Generate all programmatic sprites
    generateSprites(this);

    // Generate beauty overlays
    for (const product of BEAUTY_PRODUCTS) {
      generateBeautyOverlay(this, product.id);
    }

    // Generate special item overlays
    for (const item of SPECIAL_ITEMS) {
      generateSpecialItemOverlay(this, item.id);
    }

    // Transition to menu
    this.scene.start('MenuScene');
  }
}
