/* @layer core @kind types */
import type { CelId, FrameId, LayerId, MapLayerId, SpriteId, TilemapId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { LOAD_ERROR } from './load-error.constants';
import type { Manifest } from './manifest.type';

type LoadErrorCode = (typeof LOAD_ERROR)[keyof typeof LOAD_ERROR];
type LoadOutcome = 'ok' | 'recoverable' | 'fatal';

type LoadIssue = {
  readonly code: LoadErrorCode;
  readonly message: string;
  readonly path: string | null;
};

type DamagedCel = {
  readonly celId: CelId;
  readonly spriteId: SpriteId | null;
  readonly layerId: LayerId | null;
  readonly frameId: FrameId | null;
  readonly code: LoadErrorCode;
  readonly message: string;
};

type DamagedMapLayer = {
  readonly tilemapId: TilemapId;
  readonly layerId: MapLayerId;
  readonly code: LoadErrorCode;
  readonly message: string;
};

type LoadReport = {
  readonly outcome: LoadOutcome;
  readonly artwork: Artwork | null;
  readonly readOnly: boolean;
  readonly notice: string | null;
  readonly migrated: boolean;
  readonly manifest: Manifest | null;
  readonly preview: Uint8Array | null;
  readonly issues: readonly LoadIssue[];
  readonly damage: readonly DamagedCel[];
  readonly mapDamage: readonly DamagedMapLayer[];
};

export type { DamagedCel, DamagedMapLayer, LoadErrorCode, LoadIssue, LoadOutcome, LoadReport };
