import { TileType, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, COLORS } from '../utils/constants'

export class GameMap {
  tiles: number[][] = []

  constructor() {
    this.initEmpty()
  }

  private initEmpty(): void {
    this.tiles = []
    for (let y = 0; y < MAP_HEIGHT; y++) {
      this.tiles[y] = []
      for (let x = 0; x < MAP_WIDTH; x++) {
        this.tiles[y][x] = TileType.EMPTY
      }
    }
  }

  getTile(x: number, y: number): number {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return TileType.STEEL
    return this.tiles[y][x]
  }

  setTile(x: number, y: number, type: TileType): void {
    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      this.tiles[y][x] = type
    }
  }

  destroyBrick(tileX: number, tileY: number): void {
    if (this.getTile(tileX, tileY) === TileType.BRICK) {
      this.setTile(tileX, tileY, TileType.EMPTY)
    }
  }

  canMove(x: number, y: number, width: number, height: number): boolean {
    const left = Math.floor(x / TILE_SIZE)
    const right = Math.floor((x + width - 1) / TILE_SIZE)
    const top = Math.floor(y / TILE_SIZE)
    const bottom = Math.floor((y + height - 1) / TILE_SIZE)

    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        const tile = this.getTile(tx, ty)
        if (tile === TileType.BRICK || tile === TileType.STEEL || tile === TileType.WATER) {
          return false
        }
      }
    }
    return true
  }

  canShootThrough(x: number, y: number): boolean {
    const tile = this.getTile(x, y)
    return tile !== TileType.STEEL
  }

  generateLevel(level: number): void {
    this.initEmpty()

    // Border walls
    for (let x = 0; x < MAP_WIDTH; x++) {
      this.setTile(x, 0, TileType.STEEL)
      this.setTile(x, MAP_HEIGHT - 1, TileType.STEEL)
    }
    for (let y = 0; y < MAP_HEIGHT; y++) {
      this.setTile(0, y, TileType.STEEL)
      this.setTile(MAP_WIDTH - 1, y, TileType.STEEL)
    }

    // Base in center bottom area
    this.setTile(12, 11, TileType.BASE)
    // Protect base with bricks
    for (let x = 10; x <= 14; x++) {
      this.setTile(x, 12, TileType.BRICK)
    }

    // Random brick clusters
    const brickCount = 20 + level * 5
    for (let i = 0; i < brickCount; i++) {
      const x = 2 + Math.floor(Math.random() * (MAP_WIDTH - 4))
      const y = 2 + Math.floor(Math.random() * (MAP_HEIGHT - 6))
      if (this.getTile(x, y) === TileType.EMPTY) {
        this.setTile(x, y, TileType.BRICK)
      }
    }

    // Water obstacles
    for (let i = 0; i < 2; i++) {
      const wx = 5 + Math.floor(Math.random() * 10)
      const wy = 3 + Math.floor(Math.random() * 6)
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 3; dx++) {
          this.setTile(wx + dx, wy + dy, TileType.WATER)
        }
      }
    }

    // Tree clusters
    for (let i = 0; i < 3; i++) {
      const tx = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6))
      const ty = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 8))
      this.setTile(tx, ty, TileType.TREE)
      if (Math.random() > 0.5) this.setTile(tx + 1, ty, TileType.TREE)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const tile = this.tiles[y][x]
        if (tile === TileType.EMPTY) continue

        const px = x * TILE_SIZE
        const py = y * TILE_SIZE

        switch (tile) {
          case TileType.BRICK:
            ctx.fillStyle = COLORS.BRICK
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE)
            ctx.strokeStyle = '#804000'
            for (let i = 0; i < 4; i++) {
              ctx.beginPath()
              ctx.moveTo(px, py + i * 8)
              ctx.lineTo(px + TILE_SIZE, py + i * 8)
              ctx.stroke()
            }
            break
          case TileType.STEEL:
            ctx.fillStyle = COLORS.STEEL
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE)
            ctx.strokeStyle = '#666'
            ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2)
            break
          case TileType.WATER:
            ctx.fillStyle = COLORS.WATER
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE)
            ctx.fillStyle = '#0088ff'
            ctx.fillRect(px + 4, py + 8, 8, 4)
            ctx.fillRect(px + 16, py + 16, 8, 4)
            break
          case TileType.TREE:
            ctx.fillStyle = COLORS.TREE
            ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8)
            ctx.fillStyle = '#008800'
            ctx.beginPath()
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 10, 0, Math.PI * 2)
            ctx.fill()
            break
          case TileType.BASE:
            ctx.fillStyle = COLORS.BASE
            ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8)
            ctx.fillStyle = '#ff6600'
            ctx.font = '20px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(' eagle', px + TILE_SIZE / 2, py + TILE_SIZE / 2)
            break
        }
      }
    }
  }
}
