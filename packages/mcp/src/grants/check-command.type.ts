/* @layer core @kind types */
import type { BundleId } from '../catalogue/catalogue.type';

type CommandItem = {
  readonly what: string;
  readonly area: BundleId;
  readonly changes: boolean;
};

export type { CommandItem };
