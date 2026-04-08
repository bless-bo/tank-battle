export interface Position {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface LevelConfig {
  enemyCount: number
  enemyTypes: { type: EnemyType; count: number }[]
  difficulty: number
}

export enum EnemyType {
  NORMAL = 'normal',
  FAST = 'fast',
  HEAVY = 'heavy'
}
