const getColor = (fraction: number) => {
  if (fraction <= 0.3) return 0xff0000; // red
  if (fraction <= 0.6) return 0xffa500; // orange
  return 0x00ff00; // green
};

class HealthBar {
  public bar: Phaser.GameObjects.Graphics;

  private x: number;

  private y: number;

  private width: number;

  private height: number;

  private padding: number;

  private background: number;

  private maxHealth: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    {
      width = 80,
      height = 5,
      padding = 2,
      background = 0x000000,
      maxHealth = 100,
    },
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.background = background;
    this.maxHealth = maxHealth;

    this.bar = scene.add.graphics();

    this.draw(this.maxHealth);
  }

  draw(value: number) {
    this.bar.clear();

    // draw the health bar track (background)
    this.bar.fillStyle(this.background, 0.5);
    this.bar.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width + this.padding * 2,
      this.height + this.padding * 2,
    );

    // draw the health bar
    const fraction = value / this.maxHealth;
    this.bar.fillStyle(getColor(fraction), 0.5);
    this.bar.fillRect(
      this.x + this.padding - this.width / 2,
      this.y + this.padding - this.height / 2,
      Math.floor(this.width * fraction),
      this.height,
    );
  }
}

export default HealthBar;
