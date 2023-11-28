import * as Phaser from 'phaser';
import config from '@/config';
import detectWebGLContext from '@/helpers/detectWebGL';
import { webFontLoader } from '@/helpers/googleFont';

import './style.css';

window.addEventListener('load', () => {
  if (!detectWebGLContext()) {
    (document.querySelector('body') as HTMLElement).innerHTML =
      '<h1>WEBGL NOT SUPPORTED.<br/>Try again with an updated Chrome or Firefox.</h1>';
    return;
  }

  // @ts-expect-error fight me!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const game = new Phaser.Game(config);

  webFontLoader();

  // prevent device sleep / auto lock when web page is open
  // https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
  // https://caniuse.com/wake-lock it doesn't work in firefox
  if ('wakeLock' in navigator) navigator.wakeLock.request('screen');
});
