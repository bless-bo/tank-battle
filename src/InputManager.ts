import { Direction } from './utils/constants'

export class InputManager {
  private keys: Set<string> = new Set()
  private touchDir: Direction | null = null

  constructor() {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))

    // Touch controls
    const touchBtns = document.querySelectorAll('.touch-btn')
    touchBtns.forEach(btn => {
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault()
        const dir = (btn as HTMLElement).dataset.dir
        if (dir === 'SHOOT') {
          this.keys.add('Space')
        } else {
          this.touchDir = Direction[dir as keyof typeof Direction]
        }
      })
      btn.addEventListener('touchend', () => {
        this.keys.delete('Space')
        this.touchDir = null
      })
    })
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys.add(e.key)
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key)
  }

  isUp(): boolean {
    return this.keys.has('ArrowUp') || this.touchDir === Direction.UP
  }

  isDown(): boolean {
    return this.keys.has('ArrowDown') || this.touchDir === Direction.DOWN
  }

  isLeft(): boolean {
    return this.keys.has('ArrowLeft') || this.touchDir === Direction.LEFT
  }

  isRight(): boolean {
    return this.keys.has('ArrowRight') || this.touchDir === Direction.RIGHT
  }

  isShoot(): boolean {
    return this.keys.has('Space')
  }

  getDirection(): Direction | null {
    if (this.isUp()) return Direction.UP
    if (this.isDown()) return Direction.DOWN
    if (this.isLeft()) return Direction.LEFT
    if (this.isRight()) return Direction.RIGHT
    return null
  }
}
