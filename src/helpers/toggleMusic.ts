import { Scene } from 'phaser';

const toggleMusic = (scene: Scene) => {
  const btn = document.getElementById('music');
  const el = document.getElementById('game');
  if (btn && el) {
    btn.addEventListener('click', () => {
      const isMute = scene.game.sound.mute;
      // eslint-disable-next-line no-param-reassign
      scene.game.sound.mute = !isMute;
      btn.textContent = isMute ? '🔊' : '🔇';
    });
  }
};

export default toggleMusic;
