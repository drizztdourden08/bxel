/* @layer core @kind logic */
import { nameKey } from '@bxel/document';
import { claimName } from './claim-name';
import type { SliceExisting } from './compose.type';
import { numberedName } from './numbered-name';

const claimPieceName = (taken: string[], name: string, existing: SliceExisting): string | null => {
  if (existing === 'fail') return claimName(taken, name);
  const clash = taken.some((each) => nameKey(each) === nameKey(name));
  if (clash && existing === 'skip') return null;
  return claimName(taken, numberedName(taken, name));
};

export { claimPieceName };
