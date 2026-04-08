import { GameState, Direction, EnemyType, TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, TileType } from './utils/constants'
import { InputManager } from './InputManager'
import { GameMap } from './map/Map'
import { PlayerTank } from './entities/PlayerTank'
import { EnemyTank } from './entities/EnemyTank'
import { Bullet } from './entities/Bullet'
import { Collision } from './Collision'

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private input: InputManager
  private map: GameMap
  private state: GameState = GameState.MENU
  private player!: PlayerTank
  private enemies: EnemyTank[] = []
  private bullets: Bullet[] = []
  private score: number = 0
  private level: number = 1
  private enemySpawnTimer: number = 0
  private enemiesSpawned: number = 0
  private enemiesToSpawn: number = 5
  private lastTime: number = 0
  private basePos: { x: number; y: number } = { x: 12, y: 11 }

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
    this.canvas.width = CANVAS_WIDTH
    this.canvas.height = CANVAS_HEIGHT
    this.ctx = this.canvas.getContext('2d')!
    this.input = new InputManager()
    this.map = new GameMap()
    this.init()
    this.gameLoop = this.gameLoop.bind(this)
    requestAnimationFrame(this.gameLoop)
  }

  private init(): void {
    this.state = GameState.PLAYING
    this.score = 0
    this.level = 1
    this.enemies = []
    this.bullets = []
    this.enemiesSpawned = 0
    this.enemySpawnTimer = 0
    this.map.generateLevel(this.level)
    this.player = new PlayerTank(13 * TILE_SIZE / 2, 12 * TILE_SIZE)
  }

  private gameLoop(timestamp: number): void {
    const dt = timestamp - this.lastTime
    this.lastTime = timestamp

    this.update(dt)
    this.render()

    requestAnimationFrame(this.gameLoop)
  }

  private update(dt: number): void {
    // Handle menu state
    if (this.state === GameState.MENU) {
      if (this.input.isShoot()) {
        this.init()
      }
      return
    }

    // Handle game over state
    if (this.state === GameState.GAMEOVER) {
      if (this.input.isShoot()) {
        this.init()
      }
      return
    }

    // Handle pause
    if (this.input.isPause()) {
      this.state = GameState.PAUSED
      return
    }

    if (this.state === GameState.PAUSED) {
      if (this.input.isPause()) {
        this.state = GameState.PLAYING
      }
      return
    }

    // Player
    const dir = this.input.getDirection()
    this.player.setDirection(dir)
    this.player.update(dt)

    // Constrain player to map
    this.player.pos.x = Math.max(0, Math.min(this.player.pos.x, (MAP_WIDTH - 2) * TILE_SIZE))
    this.player.pos.y = Math.max(0, Math.min(this.player.pos.y, (MAP_HEIGHT - 2) * TILE_SIZE))

    // Player shoot
    if (this.input.isShoot()) {
      const bullet = this.player.shoot()
      if (bullet) this.bullets.push(bullet)
    }

    // Check player collision with map
    if (Collision.tankVsMap(this.player.getRect(), this.map)) {
      // Push back
      this.player.pos.x = Math.floor(this.player.pos.x / TILE_SIZE) * TILE_SIZE
      this.player.pos.y = Math.floor(this.player.pos.y / TILE_SIZE) * TILE_SIZE
    }

    // Spawn enemies
    this.enemySpawnTimer -= dt
    if (this.enemySpawnTimer <= 0 && this.enemiesSpawned < this.enemiesToSpawn) {
      this.spawnEnemy()
      this.enemySpawnTimer = 2000
      this.enemiesSpawned++
    }

    // Update enemies
    this.enemies.forEach(e => e.update(dt))

    // Enemy shoot
    this.enemies.forEach(e => {
      if (Math.random() < 0.02) {
        const bullet = e.shoot()
        if (bullet) this.bullets.push(bullet)
      }
    })

    // Update bullets
    this.bullets.forEach(b => b.update(dt))

    // Bullet collisions
    this.bullets = this.bullets.filter(b => {
      if (b.isOutOfBounds()) return false

      // Bullet vs map
      if (Collision.bulletVsMap(b.getRect(), this.map)) {
        return false
      }

      // Bullet vs tanks
      if (b.owner === 'player') {
        // Check enemy hits
        for (let i = this.enemies.length - 1; i >= 0; i--) {
          if (Collision.checkAABB(b.getRect(), this.enemies[i].getRect())) {
            this.enemies[i].takeDamage()
            if (!this.enemies[i].isAlive) {
              this.score += this.enemies[i].score
              this.enemies.splice(i, 1)
            }
            return false
          }
        }
        // Check if bullet hits base (base is at tile 12,11)
        const baseTileX = Math.floor((b.pos.x + b.width / 2) / TILE_SIZE)
        const baseTileY = Math.floor((b.pos.y + b.height / 2) / TILE_SIZE)
        if (baseTileX === this.basePos.x && baseTileY === this.basePos.y) {
          this.state = GameState.GAMEOVER
          return false
        }
      } else {
        // Enemy bullet - check if hits player (not own tank, etc.)
        if (Collision.checkAABB(b.getRect(), this.player.getRect())) {
          this.player.takeDamage()
          if (!this.player.isAlive) {
            this.state = GameState.GAMEOVER
          }
          return false
        }
      }

      return true
    })

    // Check win condition
    if (this.enemies.length === 0 && this.enemiesSpawned >= this.enemiesToSpawn) {
      this.nextLevel()
    }
  }

  private spawnEnemy(): void {
    const types = [EnemyType.NORMAL, EnemyType.NORMAL, EnemyType.FAST, EnemyType.HEAVY]
    const type = types[Math.floor(Math.random() * types.length)]
    const x = TILE_SIZE + Math.random() * ((MAP_WIDTH - 4) * TILE_SIZE)
    this.enemies.push(new EnemyTank(x, TILE_SIZE, type))
  }

  private nextLevel(): void {
    this.level++
    this.enemies = []
    this.bullets = []
    this.enemiesSpawned = 0
    this.enemiesToSpawn = 5 + this.level
    this.map.generateLevel(this.level)
  }

  private render(): void {
    // Clear
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (this.state === GameState.MENU) {
      this.ctx.fillStyle = '#fff'
      this.ctx.font = '32px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('经典坦克大战', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
      this.ctx.font = '16px Arial'
      this.ctx.fillText('方向键移动，空格射击，P键暂停', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      this.ctx.fillText('按空格键开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
      return
    }

    if (this.state === GameState.GAMEOVER) {
      this.ctx.fillStyle = '#fff'
      this.ctx.font = '32px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('游戏结束', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20)
      this.ctx.font = '16px Arial'
      this.ctx.fillText(`得分: ${this.score}  关卡: ${this.level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
      this.ctx.fillText('按空格键重新开始', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50)
      return
    }

    if (this.state === GameState.PAUSED) {
      // Render game state in background
      this.map.render(this.ctx)
      this.player.render(this.ctx)
      this.enemies.forEach(e => e.render(this.ctx))
      this.bullets.forEach(b => b.render(this.ctx))

      // Overlay
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      this.ctx.fillStyle = '#fff'
      this.ctx.font = '32px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('游戏暂停', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      this.ctx.font = '16px Arial'
      this.ctx.fillText('按P键继续', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30)
      return
    }

    // Map
    this.map.render(this.ctx)

    // Player
    this.player.render(this.ctx)

    // Enemies
    this.enemies.forEach(e => e.render(this.ctx))

    // Bullets
    this.bullets.forEach(b => b.render(this.ctx))

    // HUD
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '14px Arial'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`分数: ${this.score}  生命: ${this.player.lives}  关卡: ${this.level}`, 10, 20)
  }
}
