/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';
import { ASSET_DRAG_TYPE } from '../ProjectBrowser.constants';

const hasAssetDrag = (event: DragEvent): boolean => event.dataTransfer.types.includes(ASSET_DRAG_TYPE);

export { hasAssetDrag };
