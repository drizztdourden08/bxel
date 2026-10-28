/* @layer renderer-app @kind types */
import type { AssetKey, DocumentId } from '@bxel/document';

type Relocation = { readonly from: string; readonly to: string };

type OpOutcome = { readonly ok: true; readonly rewritten: number } | { readonly ok: false; readonly message: string };

type HeldAsset = { readonly documentId: DocumentId; readonly key: AssetKey; readonly path: string };

export type { HeldAsset, OpOutcome, Relocation };
