/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { spriteMerge } from './compose/sprite-merge';
import { spriteSplit } from './compose/sprite-split';

const legacyRasterCommands: readonly CommandDef[] = [spriteMerge, spriteSplit];

export { legacyRasterCommands };
