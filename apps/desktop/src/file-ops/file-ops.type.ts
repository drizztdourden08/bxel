/* @layer renderer-app @kind types */
import type { AssetKey, DocumentId } from '@bxel/document';

type Relocation = { readonly from: string; readonly to: string };

type OpOutcome = { readonly ok: true; readonly rewritten: number } | { readonly ok: false; readonly message: string };

type HeldAsset = { readonly documentId: DocumentId; readonly key: AssetKey; readonly path: string };

type FolderOutcome = { readonly ok: true; readonly path: string } | { readonly ok: false; readonly message: string };

export type { FolderOutcome, HeldAsset, OpOutcome, Relocation };
