/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import type { LockKind } from './layer-lock.type';
import { LAYER_LABEL } from './layer-text.constants';
import { lockFields } from './lock-fields';
import { updateLayers } from './update-layers';

const setLayerLock = (ids: readonly LayerId[], kind: LockKind): boolean => updateLayers(ids, lockFields(kind), LAYER_LABEL.locked);

export { setLayerLock };
