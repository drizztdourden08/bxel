/* @layer renderer-app @kind types */
import type { AssetKind } from '@bxel/document';

type IndexedFile = {
  readonly path: string;
  readonly assetId: string;
  readonly kind: AssetKind;
  readonly name: string;
};

/**
 * ok: the stored path holds the file with this id. moved: it does not, and exactly one other file has the id.
 * ambiguous: several files have the id. missing: no file has it.
 */
type LinkState = 'ok' | 'moved' | 'ambiguous' | 'missing';

type IndexedLink = {
  readonly from: IndexedFile;
  readonly linkId: string;
  readonly stored: string;
  readonly target: string;
  readonly targetKind: AssetKind | null;
  readonly targetName: string;
  readonly state: LinkState;
  readonly found: IndexedFile | null;
};

type DuplicateId = { readonly assetId: string; readonly paths: readonly string[] };

type LinkIndex = {
  readonly files: readonly IndexedFile[];
  readonly links: readonly IndexedLink[];
  readonly duplicates: readonly DuplicateId[];
};

export type { DuplicateId, IndexedFile, IndexedLink, LinkIndex, LinkState };
