/* @layer core @kind types */
import type { ResolvedCel } from '../scope/resolved-scope.type';

type Held = { readonly cel: ResolvedCel; readonly before: Uint8Array | null };

export type { Held };
