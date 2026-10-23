/* @layer core @kind types */
import type { ID_PREFIX } from './id-prefix.constants';

type IdPrefix = (typeof ID_PREFIX)[keyof typeof ID_PREFIX];

type ByteProvider = (length: number) => Uint8Array;

type IdSource = {
  readonly next: (prefix: IdPrefix) => string;
  readonly fork: () => IdSource;
};

export type { ByteProvider, IdPrefix, IdSource };
