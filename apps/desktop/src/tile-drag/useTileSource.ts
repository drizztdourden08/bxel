/* @layer renderer-app @kind hook */
import { useDragSource } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { TILE_DRAG } from './tile-drag.constants';
import type { TileDragPayload, TileSourceInput } from './tile-drag.type';

const useTileSource = (ref: RefObject<DndElement | null>, input: TileSourceInput): void =>
  useDragSource<TileDragPayload>(ref, {
    type: TILE_DRAG,
    payload: () => ({ key: input.key ?? 0, index: input.index }),
    disabled: () => input.key === null || !input.picked,
    onStart: input.onStart,
    onEnd: input.onEnd,
  });

export { useTileSource };
