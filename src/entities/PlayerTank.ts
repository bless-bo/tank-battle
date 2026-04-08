import { Tank } from './Tank'
import { Bullet } from './Bullet'
import { Direction, TILE_SIZE } from '../utils/constants'

export class PlayerTank extends Tank {
  lives: number = 3
  speed: number = 3
  shotCooldown: number = 300
  invulnerable: boolean = false
  invulnerableTime: number = 0

  private inputDir: Direction | null = null

  setDirection(dir: Direction | null): void {
    this.inputDir = dir
    if (dir !== null) {
      this.direction = dir
    }
  }

  update(dt: number): void {
    if (this.invulnerable) {
      this.invulnerableTime -= dt
      if (this.invulnerableTime <= 0) {
        this.invulnerable = false
      }
    }

    if (this.inputDir !== null) {
      const moveAmount = this.speed * dt / 16
      switch (this.inputDir) {
        case Direction.UP: this.pos.y -= moveAmount; break
        case Direction.DOWN: this.pos.y += moveAmount; break
        case Direction.LEFT: this.pos.x -= moveAmount; break
        case Direction.RIGHT: this.pos.x += moveAmount; break
      }

      // Clamp to bounds
      this.pos.x = Math.max(0, Math.min(this.pos.x, 25 * TILE_SIZE))
      this.pos.y = Math.max(0, Math.min(this.pos.y, 12 * TILE_SIZE))
    }
  }

  shoot(): Bullet | null {
    const now = Date.now()
    if (now - this.lastShotTime < this.shotCooldown) return null
    this.lastShotTime = now

    // Bullet starts at front of tank
    let bx = this.pos.x + this.width / 2 - 4
    let by = this.pos.y + this.height / 2 - 4
    switch (this.direction) {
      case Direction.UP: by = this.pos.y - 8; break
      case Direction.DOWN: by = this.pos.y + this.height; break
      case Direction.LEFT: bx = this.pos.x - 8; break
      case Direction.RIGHT: bx = this.pos.x + this.width; break
    }
    return new Bullet(bx, by, this.direction, 'player')
  }

  takeDamage(): void {
    if (this.invulnerable) return
    this.lives--
    if (this.lives <= 0) {
      this.isAlive = false
    } else {
      this.invulnerable = true
      this.invulnerableTime = 2000
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) return
    ctx.fillStyle = '#00cc00'
    ctx.fillRect(this.pos.x + 4, this.pos.y + 4, this.width - 8, this.height - 8)
    // Direction indicator
    ctx.fillStyle = '#003300'
    const cx = this.pos.x + this.width / 2
    const cy = this.pos.y + this.height / 2
    switch (this.direction) {
      case Direction.UP: ctx.fillRect(cx - 2, this.pos.y + 2, 4, 8); break
      case Direction.DOWN: ctx.fillRect(cx - 2, this.pos.y + this.height - 10, 4, 8); break
      case Direction.LEFT: ctx.fillRect(this.pos.x + 2, cy - 2, 8, 4); break
      case Direction.RIGHT: ctx.fillRect(this.pos.x + this.width - 10, cy - 2, 8, 4); break
    }
  }
}
