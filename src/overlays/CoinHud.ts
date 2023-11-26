class CoinHud {
  private coinHud: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, value: number) {
    this.coinHud = scene.add
      .text(10, 10, '', {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      })
      .setScrollFactor(0);

    this.updateCoinsDisplay(value);
  }

  updateCoinsDisplay(newCoinsValue: number) {
    this.coinHud.setText(`🪙 ${String(newCoinsValue).padStart(5, '0')}`);
  }
}

export default CoinHud;
