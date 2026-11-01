/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { guideHereEntries } from './guide-here-entries';

const viewHereEntries = (here: Point | null): readonly ContextMenuEntry[] => [
  { command: COMMAND_ID.centreHere, hidden: here === null, args: { x: here?.x, y: here?.y } },
  guideHereEntries(here),
];

export { viewHereEntries };
