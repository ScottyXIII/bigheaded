// Collision Categories
// outline the categories (or types of things) that can be found in the game
export enum CC {
  default = 0b00000000000000000000000000000001, // 1 (the default category, for things without collisioncategory override, such as ground)
  player = 0b00000000000000000000000000000010, // 2
  enemy = 0b00000000000000000000000000000100, // 4
  item = 0b00000000000000000000000000001000, // 8
  layer32 = 0b10000000000000000000000000000000, // 2147483648 (32 max layer, max 32 types of things in the game)
}

// Collision Masks
// define which categories a type of entity can collide with
// more info: https://blog.ourcade.co/posts/2020/phaser-3-matter-physics-collision-filter/
// combine categories with pipe (|) character
/* eslint-disable no-bitwise */
export enum CollisionMasks {
  everything = -1, // collides with everything (default)
  player = CC.default | CC.enemy | CC.item,
  enemy = CC.default | CC.player, // not items or enemies
  item = CC.default | CC.player, // not items or enemies
}
