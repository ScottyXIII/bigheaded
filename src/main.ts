import './style.css';
import { Game } from 'phaser';
import config from '@/config';
import resize from '@/helpers/resize';

window.onload = () => {
  const game = new Game(config);
  resize(config);

  window.onresize = newConfig => {
    resize(newConfig);
    game.events.emit('resize');
  };
};
