/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { currentSurface } from '../surface/current-surface';
import type { Surface } from '../surface/surface.type';
import { editorCommand } from './editor-command';

const onSurface =
  (...surfaces: readonly Surface[]) =>
  (def: CommandDef): CommandDef => {
    const own = def.when;
    return editorCommand({ ...def, when: () => surfaces.includes(currentSurface()) && (own?.() ?? true) });
  };

export { onSurface };
