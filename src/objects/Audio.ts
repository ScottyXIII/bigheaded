import Phaser from 'phaser';

type AudioConfigType = {
  key: string;
  filePath: string;
  loop: boolean;
  volume?: number;
  soundConfig?: Phaser.Types.Sound.SoundConfig;
};

class Audio {
  private audio: Record<
    string,
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  > = {};

  private audioConfig: Record<string, AudioConfigType> = {};

  constructor(scene: Phaser.Scene, configs: AudioConfigType[]) {
    for (let i = 0; i < configs.length; i += 1) {
      const config: AudioConfigType = configs[i];
      this.audioConfig[config.key] = config;
      this.audio[config.key] = scene.sound.add(
        config.key,
        config.soundConfig ?? {},
      );
    }
  }

  static preload(scene: Phaser.Scene, configs: AudioConfigType[]) {
    for (let i = 0; i < configs.length; i += 1) {
      const config: AudioConfigType = configs[i];
      scene.load.audio(config.key, config.filePath);
    }
  }

  playAudio(key: string) {
    if (!!this.audio[key] && !!this.audioConfig[key]) {
      this.audio[key].loop = this.audioConfig[key].loop;
      this.audio[key].play();
    }
  }

  // update(time: number, delta: number) {}
}

export default Audio;
