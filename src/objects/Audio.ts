import Phaser from 'phaser';

type AudioConfigType = {
  key: string;
  filePath: string;
  loop: boolean;
  volume?: number;
  soundConfig?: Phaser.Types.Sound.SoundConfig;
  isMusic?: boolean;
};

class Audio {
  private audio: Record<
    string,
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
  > = {};

  private audioConfig: Record<string, AudioConfigType> = {};

  static preload(scene: Phaser.Scene, configs: AudioConfigType[]) {
    for (let i = 0; i < configs.length; i += 1) {
      const config: AudioConfigType = configs[i];
      scene.load.audio(config.key, config.filePath);
    }
  }

  constructor(scene: Phaser.Scene, configs: AudioConfigType[]) {
    for (let i = 0; i < configs.length; i += 1) {
      const config: AudioConfigType = configs[i];
      this.audioConfig[config.key] = config;
      this.audio[config.key] = scene.sound.add(
        config.key,
        config.soundConfig ?? {},
      );
    }

    // boy better know and it's shutdown all known keys
    scene.events.on('shutdown', () => {
      for (let i = 0; i < configs.length; i += 1) {
        const config: AudioConfigType = configs[i];
        const { key } = config;
        this.stopAudio(key);
      }
    });
  }

  setSFXMute(mute: boolean) {
    Object.entries(this.audioConfig).forEach(([key, config]) => {
      if (!config.isMusic || config.isMusic === undefined) {
        this.audio[key].setMute(mute);
      }
    });
  }

  setMusicMute(mute: boolean) {
    Object.entries(this.audioConfig).forEach(([key, config]) => {
      if (config.isMusic) {
        this.audio[key].setMute(mute);
      }
    });
  }

  playAudio(key: string) {
    if (!!this.audio[key] && !!this.audioConfig[key]) {
      this.audio[key].loop = this.audioConfig[key].loop;
      this.audio[key].play();
    }
  }

  stopAudio(key: string) {
    this.audio[key]?.stop();
  }

  // update(time: number, delta: number) {}
}

export default Audio;
