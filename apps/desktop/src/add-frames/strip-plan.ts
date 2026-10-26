/* @layer renderer-app @kind logic */
import { CommandFailure, stripCells } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import type { StripPlan, StripSpec } from './add-frames.type';
import { stripGrid } from './strip-grid';

const stripPlan = (sprite: Sprite | null, spec: StripSpec): StripPlan => {
  if (!sprite) return { cells: [], error: null };
  try {
    return { cells: stripCells(sprite, stripGrid(spec), undefined, 'strip'), error: null };
  } catch (error) {
    return { cells: [], error: error instanceof CommandFailure ? error.error.message : 'The strip cannot be cut that way.' };
  }
};

export { stripPlan };
