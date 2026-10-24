/* @layer renderer-app @kind logic */
import { ASSET_LIST_TEXT } from './asset-list-text.constants';

const copyName = (taken: readonly string[], name: string): string => {
  const used = new Set(taken.map((each) => each.toLowerCase()));
  const first = `${name}${ASSET_LIST_TEXT.copySuffix}`;
  let candidate = first;
  for (let number = 2; used.has(candidate.toLowerCase()); number += 1) candidate = `${first} ${number}`;
  return candidate;
};

export { copyName };
