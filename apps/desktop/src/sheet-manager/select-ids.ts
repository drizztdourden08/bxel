/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { selectEntries } from './select-entries';

const selectIds = (ids: readonly SpriteId[]): void => selectEntries(ids);

export { selectIds };
