/* @layer renderer-app @kind types */
import type { AssetKey, DocumentId } from '@bxel/document';

type Relocation = { readonly from: string; readonly to: string };

type OpOutcome = { readonly ok: true; readonly rewritten: number } | { readonly ok: false; readonly message: string };

type Affected = { readonly documentId: DocumentId; readonly key: AssetKey; readonly from: string; readonly referrer: boolean };

type HeldAsset = { readonly documentId: DocumentId; readonly key: AssetKey; readonly path: string };

type FolderOutcome = { readonly ok: true; readonly path: string } | { readonly ok: false; readonly message: string };

export type { Affected, FolderOutcome, HeldAsset, OpOutcome, Relocation };
