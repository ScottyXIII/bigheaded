import * as Phaser from 'phaser';
import config from '@/config';
import attachFullscreen from './helpers/fullscreen';

import './style.css';

window.onload = () => {
  // @ts-expect-error not sure how to defeat this one
  window.game = new Phaser.Game(config);

  attachFullscreen();
};
