import { Entity } from './Entity'
import { Direction, TILE_SIZE } from '../utils/constants'

export class Bullet extends Entity {
  owner: 'player' | 'enemy'
  speed: number = 5

  constructor(x: number, y: number, direction: Direction, owner: 'player' | 'enemy') {
    super(x, y)
    this.direction = direction
    this.owner = owner
    this.width = 8
    this.height = 8
  }

  update(dt: number): void {
    const moveAmount = this.speed * dt / 16
    switch (this.direction) {
      case Direction.UP: this.pos.y -= moveAmount; break
      case Direction.DOWN: this.pos.y += moveAmount; break
      case Direction.LEFT: this.pos.x -= moveAmount; break
      case Direction.RIGHT: this.pos.x += moveAmount; break
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffff00'
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
  }

  isOutOfBounds(): boolean {
    return this.pos.x < 0 || this.pos.x > 26 * TILE_SIZE ||
           this.pos.y < 0 || this.pos.y > 13 * TILE_SIZE
  }
}
