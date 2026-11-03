/* @layer renderer-app @kind logic */
import { emptyMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from '../../editor/editor.type';
import { incomingMask } from './incoming-mask';
import { pointIncoming } from './point-incoming';
import { savedIncoming } from './saved-incoming';
import type { Shape } from './selection-step.type';

const shapeIncoming = (shape: Shape, target: EditorTarget): MaskView | 'outside' | 'missing' | 'resized' =>
  incomingMask(shape, target) ?? pointIncoming(shape, target) ?? savedIncoming(shape, target) ?? emptyMask(target.sprite);

export { shapeIncoming };
