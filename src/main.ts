import './style.css';
import { Game } from 'phaser';

import config from '@/config';
import resize from '@/helpers/resize';
import createOrchestrator from '@/ai/reinforcement-learning/create-orchestrator';
import GameScene from './scenes/game-scene';

window.onload = () => {
  const game = new Game(config);
  resize(config);

  window.onresize = newConfig => {
    resize(newConfig);
    game.events.emit('resize');
  };

  const currentScene = game.scene.scenes[0] as GameScene;

  (async () => {
    const { run, replay } = await createOrchestrator(
      currentScene,
      // calculate state func
      () => {
        // eslint-disable-next-line no-console
        console.log(currentScene.ben?.body?.position);
      },
      // reward func
      () => {
        //   if (position >= 0.5) {
        //     return 100;
        //   }
        //   if (position >= 0.25) {
        //     return 20;
        //   }
        //   if (position >= 0.1) {
        //     return 10;
        //   }
        //   if (position >= 0) {
        //     return 5;
        //   }
        //   return 0;
      },
    );

    // @ts-ignore
    window.run = run;

    // @ts-ignore
    window.replay = replay;
  })();
};
