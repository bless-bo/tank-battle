import { Position, Rect } from '../utils/types'
import { Direction, TileType, TILE_SIZE } from '../utils/constants'

export abstract class Entity {
  pos: Position
  width: number = TILE_SIZE
  height: number = TILE_SIZE
  direction: Direction = Direction.UP
  speed: number = 2
  isAlive: boolean = true

  constructor(x: number, y: number) {
    this.pos = { x, y }
  }

  getRect(): Rect {
    return {
      x: this.pos.x,
      y: this.pos.y,
      width: this.width,
      height: this.height
    }
  }

  abstract update(dt: number): void
  abstract render(ctx: CanvasRenderingContext2D): void
}
