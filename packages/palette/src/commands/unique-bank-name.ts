/* @layer core @kind logic */
import { MAX_NAME_LENGTH, nameKey } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { COPY_SUFFIX } from './copy-suffix.constants';

const uniqueBankName = (artwork: Artwork, source: string): string => {
  const taken = new Set(artwork.banks.map((bank) => nameKey(bank.name)));
  const base = `${source.slice(0, MAX_NAME_LENGTH - COPY_SUFFIX.reserve)}${COPY_SUFFIX.text}`;
  let candidate = base;
  for (let count = 2; taken.has(nameKey(candidate)); count += 1) candidate = `${base} ${count}`;
  return candidate;
};

export { uniqueBankName };
