import * as Phaser from 'phaser';
import config from '@/config';
import attachFullscreen from './helpers/fullscreen';

import './style.css';

window.onload = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new Phaser.Game(config);

  attachFullscreen();
};
