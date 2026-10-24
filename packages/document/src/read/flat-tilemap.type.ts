/* @layer core @kind types */
import type { BankId } from '../model/ids.type';

type FlatTilemap = {
  readonly width: number;
  readonly height: number;
  readonly bankId: BankId;
  readonly pixels: Uint8Array;
};

export type { FlatTilemap };
