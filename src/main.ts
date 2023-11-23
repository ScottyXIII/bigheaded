import * as Phaser from 'phaser';
import config from '@/config';
import attachFullscreen from '@/helpers/fullscreen';
import detectWebGLContext from './helpers/detectWebGL';

import './style.css';

window.onload = () => {
  if (!detectWebGLContext()) {
    (document.querySelector('body') as HTMLElement).innerHTML =
      '<h1>WEBGL NOT SUPPORTED.<br/>Try again with an updated Chrome or Firefox.</h1>';
    return;
  }

  // @ts-expect-error fight me!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new Phaser.Game(config);

  attachFullscreen();
};
