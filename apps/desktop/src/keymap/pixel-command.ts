/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { hasActiveDocument } from '../files/has-active-document';
import { inMapPlace } from '../tilemap/in-map-place';

const pixelCommand = (def: CommandDef): CommandDef => {
  const base = def.when ?? hasActiveDocument;
  return { ...def, when: () => base() && !inMapPlace() };
};

export { pixelCommand };
