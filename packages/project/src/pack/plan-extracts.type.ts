/* @layer core @kind types */
import type { ExtractOperation, SkippedFile } from './pack.type';

type Extracts = { readonly extracts: readonly ExtractOperation[]; readonly skipped: readonly SkippedFile[] };

export type { Extracts };
