/* @layer renderer-app @kind logic */
import type { selectionMask } from '../editor/selection/selection-mask';
import type { ReplaceScope } from './palette-panel.type';

const withMask = (scope: ReplaceScope, mask: ReturnType<typeof selectionMask>): { mask?: NonNullable<ReturnType<typeof selectionMask>> } => (scope === 'selection' && mask ? { mask } : {});

export { withMask };
