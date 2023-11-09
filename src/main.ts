import './style.css';
import { Game } from 'phaser';

import config from '@/config';
import resize from '@/helpers/resize';
import createOrchestrator from '@/ai/reinforcement-learning/create-orchestrator';

window.onload = () => {
  const game = new Game(config);
  resize(config);

  window.onresize = newConfig => {
    resize(newConfig);
    game.events.emit('resize');
  };

  (async () => {
    const { run, replay } = await createOrchestrator(
      game.scene.scenes[0],
      () => {
        // reward func
      },
    );

    // @ts-ignore
    window.run = run;

    // @ts-ignore
    window.replay = replay;
  })();
};
