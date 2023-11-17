import { Scene } from 'phaser';
import useLocalStorage from './useLocalStorage';

const handleClick = (scene: Scene, btn: Element) => () => {
  const [isMute, setIsMute] = useLocalStorage('isMute', false);
  const newIsMute = !isMute;
  setIsMute(newIsMute);
  scene.game.sound.mute = newIsMute;
  const icon = newIsMute ? '🔇' : '🔊';
  btn.textContent = icon;
};

const toggleMusic = (scene: Scene) => {
  const btn = document.getElementById('music');
  const el = document.getElementById('game');
  if (btn && el) {
    const [isMute] = useLocalStorage('isMute', false);
    const icon = isMute ? '🔇' : '🔊';
    btn.textContent = icon;
    btn.addEventListener('click', handleClick(scene, btn));
  }
};

export default toggleMusic;
