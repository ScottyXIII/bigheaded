class CoinHud {
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, value: number) {
    this.text = scene.add
      .text(10, 10, '', {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      })
      .setScrollFactor(0);

    this.updateCoinsDisplay(value);
  }

  updateCoinsDisplay(newCoinsValue: number) {
    this.text.setText(`🪙 ${String(newCoinsValue).padStart(5, '0')}`);
  }
}

export default CoinHud;
