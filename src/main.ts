import * as Phaser from 'phaser';
import config from '@/config';
import attachFullscreen from './helpers/fullscreen';

import './style.css';

window.onload = () => {
  const game = new Phaser.Game(config);

  game.events.addListener('ready', () => {
    game.scene.getScene('scene-game').events.on('create', () => {
      // @ts-expect-error nope
      window.killSpinner();
    });
  });

  attachFullscreen();
};
