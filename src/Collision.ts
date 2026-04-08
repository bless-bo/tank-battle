import { Rect } from './utils/types'
import { TileType, TILE_SIZE } from './utils/constants'
import { GameMap } from './map/Map'

export class Collision {
  static checkAABB(a: Rect, b: Rect): boolean {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y
  }

  static tankVsMap(tank: Rect, map: GameMap): boolean {
    const left = Math.floor(tank.x / TILE_SIZE)
    const right = Math.floor((tank.x + tank.width - 1) / TILE_SIZE)
    const top = Math.floor(tank.y / TILE_SIZE)
    const bottom = Math.floor((tank.y + tank.height - 1) / TILE_SIZE)

    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        const tile = map.getTile(tx, ty)
        if (tile === TileType.BRICK || tile === TileType.STEEL || tile === TileType.WATER) {
          return true
        }
      }
    }
    return false
  }

  static bulletVsMap(bullet: Rect, map: GameMap): boolean {
    const tx = Math.floor((bullet.x + bullet.width / 2) / TILE_SIZE)
    const ty = Math.floor((bullet.y + bullet.height / 2) / TILE_SIZE)
    const tile = map.getTile(tx, ty)
    if (tile === TileType.BRICK) {
      map.destroyBrick(tx, ty)
      return true
    }
    return tile === TileType.STEEL || tile === TileType.WATER
  }

  static entityVsEntity(a: Rect, b: Rect): boolean {
    return this.checkAABB(a, b)
  }
}
