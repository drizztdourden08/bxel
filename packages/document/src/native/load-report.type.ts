/* @layer core @kind types */
import type { CelId, FrameId, LayerId, SpriteId } from '../model/ids.type';
import type { Project } from '../model/project.type';
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

type LoadReport = {
  readonly outcome: LoadOutcome;
  readonly project: Project | null;
  readonly readOnly: boolean;
  readonly notice: string | null;
  readonly migrated: boolean;
  readonly manifest: Manifest | null;
  readonly preview: Uint8Array | null;
  readonly issues: readonly LoadIssue[];
  readonly damage: readonly DamagedCel[];
};

export type { DamagedCel, LoadErrorCode, LoadIssue, LoadOutcome, LoadReport };
