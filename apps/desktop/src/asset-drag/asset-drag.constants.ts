/* @layer renderer-app @kind constants */
import { defineDragType } from '@drizztdourden08/brock-react';
import type { DragAsset } from './asset-drag.type';

const ASSET_DRAG = defineDragType<readonly DragAsset[]>('bxel.assets');

export { ASSET_DRAG };
