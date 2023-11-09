import './style.css';
import * as Phaser from 'phaser';
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

    const thing = () => {
      const currentScene = game.scene.scenes[0] as GameScene;

      const { ben } = currentScene;

      if (!ben?.torso) return;

      const action = run(1, 2);

      const xyForce = { x: action / 10, y: 0 };

      // @ts-ignore
      Phaser.Physics.Matter.Matter.Body.applyForce(
        ben.torso.body,
        ben.torso.getCenter(),
        xyForce,
      );
    };

    setInterval(thing, 50);

    // @ts-ignore
    window.run = thing;

    // @ts-ignore
    window.replay = replay;
  })();
};
