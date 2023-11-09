const parallax = (assetName, path, imgCount) => {
  const preLoad = () => {
    Array.from({ length: imgCount }).forEach(index => {
      this.Phaser.load.image(`background${index}`, `${path}/${index}.png`);
    });
  };

  const { width } = this.Phaser.scale;
  const { height } = this.Phaser.scale;
  for (let x = 1; x <= this.parallax.backgroundCount; x++) {
    const scrollFactorX = 0.01 + x / 20;
    const scrollFactorY = 0.01 + x / 50;
    this.Phaser.add
      .image(width, height, `background${x}`)
      .setOrigin(0, 0)
      .setScrollFactor(scrollFactorX, scrollFactorY)
      .setPosition(0, 0)
      .setSize(width, height);
  }

  return { preLoad };
};

export default parallax;
