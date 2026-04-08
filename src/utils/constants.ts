// Constants
export const TILE_SIZE = 32
export const MAP_WIDTH = 26
export const MAP_HEIGHT = 13
export const CANVAS_WIDTH = MAP_WIDTH * TILE_SIZE
export const CANVAS_HEIGHT = MAP_HEIGHT * TILE_SIZE
export const FPS = 60

// Tile types
export enum TileType {
  EMPTY = 0,
  BRICK = 1,
  STEEL = 2,
  WATER = 3,
  TREE = 4,
  BASE = 5
}

// Directions
export enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3
}

// Game states
export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAMEOVER = 'gameover'
}

// AI states
export enum AIState {
  PATROL = 'patrol',
  CHASE = 'chase',
  ATTACK = 'attack'
}

// Enemy types
export enum EnemyType {
  NORMAL = 'normal',
  FAST = 'fast',
  HEAVY = 'heavy'
}

// Colors
export const COLORS = {
  EMPTY: '#000',
  BRICK: '#b85c00',
  STEEL: '#888',
  WATER: '#0066cc',
  TREE: '#006600',
  BASE: '#ffcc00',
  PLAYER: '#00cc00',
  ENEMY: '#cc0000',
  BULLET: '#ffff00'
}
