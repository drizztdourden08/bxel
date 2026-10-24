/* @layer core @kind types */
import type { ChangeSet } from '../commands/result.type';
import type { Artwork } from '../model/artwork.type';
import type { BankId } from '../model/ids.type';

type UseInput = {
  readonly artwork: Artwork;
  readonly base: Artwork;
  readonly changes: ChangeSet;
  readonly bankIds: ReadonlySet<BankId>;
};

export type { UseInput };
