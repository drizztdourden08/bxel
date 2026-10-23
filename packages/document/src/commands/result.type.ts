/* @layer core @kind types */
import type { Rect } from '../model/geometry.type';
import type { BankId, CelId, FrameId, LayerId, PresetId, SheetId, SpriteId } from '../model/ids.type';
import type { CommandError } from './command-error.type';
import type { TransactionMode } from './transaction.type';

type EntityChange<I> = { readonly id: I; readonly kind: 'added' | 'removed' | 'updated' };

type CelChange = {
  readonly celId: CelId;
  readonly layerId: LayerId;
  readonly frameId: FrameId;
  readonly rect: Rect;
};

type SpriteChange = EntityChange<SpriteId> & {
  readonly meta: boolean;
  readonly structure: boolean;
  readonly recolored: boolean;
  readonly cels: readonly CelChange[];
};

type ChangeSet = {
  readonly project: boolean;
  readonly banks: readonly EntityChange<BankId>[];
  readonly sprites: readonly SpriteChange[];
  readonly sheets: readonly EntityChange<SheetId>[];
  readonly presets: readonly EntityChange<PresetId>[];
};

type PreviewCel = CelChange & { readonly pixels: Uint8Array };

type PreviewData = {
  readonly cels: readonly PreviewCel[];
  readonly colorUse: Readonly<Record<BankId, readonly number[]>>;
  readonly truncated: boolean;
};

type CommandWarning = { readonly code: string; readonly step: number; readonly message: string };

type TransactionOk = {
  readonly ok: true;
  readonly mode: TransactionMode;
  readonly baseRevision: number;
  readonly revision: number;
  readonly noop: boolean;
  readonly changes: ChangeSet;
  readonly created: Readonly<Record<string, string>>;
  readonly warnings: readonly CommandWarning[];
  readonly preview: PreviewData | null;
};

type TransactionFailed = {
  readonly ok: false;
  readonly baseRevision: number;
  readonly revision: number;
  readonly error: CommandError;
};

type TransactionResult = TransactionOk | TransactionFailed;

export type {
  CelChange,
  ChangeSet,
  CommandWarning,
  EntityChange,
  PreviewCel,
  PreviewData,
  SpriteChange,
  TransactionFailed,
  TransactionOk,
  TransactionResult,
};
