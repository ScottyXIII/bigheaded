import './style.css';
import { Game } from 'phaser';

import { config } from '@/config';
import { resize } from '@/helpers/resize';

window.onload = () => {
  const game = new Game(config);
  resize(config);

  window.onresize = (config) => {
    resize(config);
    game.events.emit('resize');
  };
};
