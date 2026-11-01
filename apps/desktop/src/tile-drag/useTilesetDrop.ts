/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../asset-drag/asset-drag.constants';
import { assetEntries } from '../sheet-manager/asset-entries';
import { dropAssetsOnTileset, dropFilesOnTileset } from './drop-on-tileset';
import type { TilesetDropPayload } from './tile-drag.type';

const useTilesetDrop = (ref: RefObject<DndElement | null>): void =>
  useDropTarget<TilesetDropPayload>(ref, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => 'files' in payload || assetEntries(payload).some((entry) => entry.kind === 'sprite'),
    onDrop: (payload) => {
      if ('files' in payload) void dropFilesOnTileset(payload.files);
      else dropAssetsOnTileset(payload);
    },
  });

export { useTilesetDrop };
