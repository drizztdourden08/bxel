/* @layer core @kind types */
import type { TransactionOrigin } from '../commands/transaction.type';
import type { Rect } from '../model/geometry.type';
import type { BankId, CelId, SpriteId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { COLLECTION_KEYS } from './entity-path.constants';

type UndoOp =
  | {
      readonly kind: 'cel-rect';
      readonly spriteId: SpriteId;
      readonly celId: CelId;
      readonly rect: Rect;
      readonly before: Uint8Array;
      readonly after: Uint8Array;
    }
  | { readonly kind: 'cel-remap'; readonly bankId: BankId; readonly forward: Uint8Array; readonly inverse: Uint8Array }
  | { readonly kind: 'entity'; readonly path: string; readonly before: unknown; readonly after: unknown };

type HistoryEntry = {
  readonly id: number;
  readonly label: string;
  readonly origin: TransactionOrigin;
  readonly actor: string;
  readonly bytes: number;
  readonly ops: readonly UndoOp[];
};

type HistoryLimits = { readonly maxBytes: number; readonly maxEntries: number };

type HistoryState = {
  readonly entries: readonly HistoryEntry[];
  readonly cursor: number;
  readonly savedCursor: number | null;
};

type HistoryDirection = 'undo' | 'redo';

type CollectionKey = (typeof COLLECTION_KEYS)[number];

type ArtworkMeta = Pick<Artwork, 'name' | 'defaultBankId' | 'coverSpriteId' | 'platformId' | 'platformStrict'>;

export type { CollectionKey, HistoryDirection, HistoryEntry, HistoryLimits, HistoryState, ArtworkMeta, UndoOp };
