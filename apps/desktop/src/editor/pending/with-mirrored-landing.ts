/* @layer renderer-app @kind logic */
import { combineMasks } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import { mirrorSiblings } from '../transform/mirror-siblings';
import type { PendingEdit } from './pending.type';
import { pendingLanding } from './pending-landing';

const withMirroredLanding = (target: EditorTarget, pending: PendingEdit, landing: MaskView | null): MaskView | null =>
  mirrorSiblings(target, pending).reduce<MaskView | null>((sum, sibling) => {
    const extra = pendingLanding(target, sibling);
    if (!extra) return sum;
    return sum ? combineMasks(sum, extra, 'add') : extra;
  }, landing);

export { withMirroredLanding };
