import * as Phaser from 'phaser';
import config from '@/config';
import attachFullscreen from './helpers/fullscreen';

import './style.css';

window.onload = () => {
  // @ts-ignore
  window.game = new Phaser.Game(config);

  attachFullscreen();
};
