/* @layer renderer-app @kind logic */
import { uniqueName } from '../sprite-name/unique-name';
import { KIND_GRID, KIND_NAME } from './new-sprite.constants';
import type { CreationForm, FormNames } from './new-sprite.type';

const kindChange = (current: CreationForm, change: Partial<CreationForm>, names: FormNames): Partial<CreationForm> => {
  if (change.kind === undefined || change.kind === current.kind) return change;
  const grid = KIND_GRID[change.kind === 'tilemap' ? 'map' : 'sheet'];
  return { ...grid, ...change, name: uniqueName(KIND_NAME[change.kind], names.namesFor(change.kind)), tilesetId: current.tilesetId || names.firstTileset };
};

export { kindChange };
