/* @layer core @kind types */
import type { BankId } from '@bxel/document';

type ResolvedPair = { readonly source: BankId; readonly from: number; readonly to: number };

type SwatchPair = { readonly from: string; readonly to: string };

export type { ResolvedPair, SwatchPair };
