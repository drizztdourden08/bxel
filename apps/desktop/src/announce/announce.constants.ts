/* @layer renderer-app @kind constants */
import type { SpriteMode } from '../stores/sprite-store.type';

const MODE_WORDS: Readonly<Record<SpriteMode, string>> = {
  sprite: 'Sprite mode',
  sheet: 'Sheet mode',
  tilemap: 'Tilemap mode',
};

const ANNOUNCE_TEXT = {
  saved: (name: string): string => `Saved ${name}`,
  tool: (label: string): string => `${label} tool`,
  mode: (mode: SpriteMode): string => MODE_WORDS[mode],
  cell: (x: number, y: number): string => `x ${x}, y ${y}`,
  cellColour: (x: number, y: number, colour: string): string => `x ${x}, y ${y}, ${colour}`,
  painted: (x: number, y: number): string => `Painted x ${x}, y ${y}`,
  filled: (x: number, y: number): string => `Filled from x ${x}, y ${y}`,
  picked: (colour: string): string => `Picked ${colour}`,
  shapeStarted: (x: number, y: number): string => `Shape started at x ${x}, y ${y}. Move and press Space or Enter to finish.`,
  mapCell: (x: number, y: number, key: number): string => `Cell ${x}, ${y}, ${key === 0 ? 'empty' : `tile ${key}`}`,
  mapDone: (x: number, y: number): string => `Placed at cell ${x}, ${y}`,
  mapCorner: (x: number, y: number): string => `Corner set at cell ${x}, ${y}. Move and press Space to finish.`,
  mapActed: (x: number, y: number): string => `Done at cell ${x}, ${y}`,
  shapeDone: 'Shape drawn',
  edge: 'Edge of the sprite',
  blocked: 'Nothing was drawn',
} as const;

export { ANNOUNCE_TEXT };
