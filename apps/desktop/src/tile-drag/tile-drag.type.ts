/* @layer renderer-app @kind types */
import type { DroppedFiles } from '@drizztdourden08/brock-react';
import type { DragAsset } from '../asset-drag/asset-drag.type';

interface TileDragPayload {
  readonly key: number;
  readonly index: number;
}

interface TileSourceInput {
  key: number | null;
  index: number;
  picked: boolean;
  onStart: () => void;
  onEnd: () => void;
}

type TileDropPayload = readonly DragAsset[];

type TilesetDropPayload = DroppedFiles | readonly DragAsset[];

type TilesAdded = { ok: true; count: number } | { ok: false; reason: string };

interface TileBlock {
  width: number;
  height: number;
  pixels: Uint8Array;
}

type BlocksRead = { ok: true; blocks: TileBlock[] } | { ok: false; reason: string };

export type { BlocksRead, TileBlock, TileDragPayload, TileDropPayload, TileSourceInput, TilesAdded, TilesetDropPayload };
