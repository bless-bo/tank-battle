import { Entity } from './Entity'
import { Bullet } from './Bullet'
import { Direction } from '../utils/constants'

export abstract class Tank extends Entity {
  health: number = 1
  lastShotTime: number = 0
  shotCooldown: number = 500

  abstract shoot(): Bullet | null

  takeDamage(): void {
    this.health--
    if (this.health <= 0) {
      this.isAlive = false
    }
  }
}
