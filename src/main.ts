import * as Phaser from 'phaser';
import config from '@/config';

import './style.css';

window.onload = () => {
  const game = new Phaser.Game(config);

  // eslint-disable-next-line no-console
  console.log(game);
};
