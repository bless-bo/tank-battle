import { Tank } from './Tank'
import { Bullet } from './Bullet'
import { Direction, EnemyType, AIState, TILE_SIZE } from '../utils/constants'

export class EnemyTank extends Tank {
  type: EnemyType = EnemyType.NORMAL
  aiState: AIState = AIState.PATROL
  score: number = 100
  private thinkTimer: number = 0
  private moveTimer: number = 0
  private currentMoveDir: Direction = Direction.UP

  constructor(x: number, y: number, type: EnemyType = EnemyType.NORMAL) {
    super(x, y)
    this.type = type
    switch (type) {
      case EnemyType.FAST:
        this.speed = 4
        this.shotCooldown = 800
        this.score = 150
        break
      case EnemyType.HEAVY:
        this.speed = 1.5
        this.health = 2
        this.shotCooldown = 1200
        this.score = 200
        break
      default:
        this.speed = 2
        this.shotCooldown = 1000
    }
  }

  update(dt: number): void {
    this.thinkTimer -= dt
    this.moveTimer -= dt

    if (this.thinkTimer <= 0) {
      this.think()
      this.thinkTimer = 500 + Math.random() * 500
    }

    if (this.moveTimer <= 0) {
      this.move()
      this.moveTimer = 100 + Math.random() * 200
    }
  }

  private think(): void {
    const r = Math.random()
    if (r < 0.3) {
      this.aiState = AIState.PATROL
    } else if (r < 0.7) {
      this.aiState = AIState.ATTACK
    } else {
      this.aiState = AIState.CHASE
    }
  }

  private move(): void {
    if (this.aiState === AIState.ATTACK) {
      return // Stay and shoot
    }

    const dirs = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
    this.currentMoveDir = dirs[Math.floor(Math.random() * 4)]
    this.direction = this.currentMoveDir

    const moveAmount = this.speed * 50 / 16
    switch (this.currentMoveDir) {
      case Direction.UP: this.pos.y = Math.max(0, this.pos.y - moveAmount); break
      case Direction.DOWN: this.pos.y = Math.min(12 * TILE_SIZE, this.pos.y + moveAmount); break
      case Direction.LEFT: this.pos.x = Math.max(0, this.pos.x - moveAmount); break
      case Direction.RIGHT: this.pos.x = Math.min(25 * TILE_SIZE, this.pos.x + moveAmount); break
    }
  }

  shoot(): Bullet | null {
    const now = Date.now()
    if (now - this.lastShotTime < this.shotCooldown) return null
    this.lastShotTime = now

    let bx = this.pos.x + this.width / 2 - 4
    let by = this.pos.y + this.height / 2 - 4
    switch (this.direction) {
      case Direction.UP: by = this.pos.y - 8; break
      case Direction.DOWN: by = this.pos.y + this.height; break
      case Direction.LEFT: bx = this.pos.x - 8; break
      case Direction.RIGHT: bx = this.pos.x + this.width; break
    }
    return new Bullet(bx, by, this.direction, 'enemy')
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.type === EnemyType.HEAVY ? '#880000' : '#cc0000'
    ctx.fillRect(this.pos.x + 4, this.pos.y + 4, this.width - 8, this.height - 8)
    // Direction indicator
    ctx.fillStyle = '#330000'
    const cx = this.pos.x + this.width / 2
    const cy = this.pos.y + this.height / 2
    switch (this.direction) {
      case Direction.UP: ctx.fillRect(cx - 2, this.pos.y + 2, 4, 8); break
      case Direction.DOWN: ctx.fillRect(cx - 2, this.pos.y + this.height - 10, 4, 8); break
      case Direction.LEFT: ctx.fillRect(this.pos.x + 2, cy - 2, 8, 4); break
      case Direction.RIGHT: ctx.fillRect(this.pos.x + this.width - 10, cy - 2, 8, 4); break
    }
    // Type indicator
    if (this.type === EnemyType.FAST) {
      ctx.fillStyle = '#ffff00'
      ctx.fillRect(cx - 4, cy - 4, 8, 8)
    } else if (this.type === EnemyType.HEAVY) {
      ctx.strokeStyle = '#ffff00'
      ctx.strokeRect(this.pos.x + 2, this.pos.y + 2, this.width - 4, this.height - 4)
    }
  }
}
