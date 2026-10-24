/* @layer core @kind logic */
import { MAX_NAME_LENGTH } from '../../model/limits.constants';
import { nameKey } from '../../validate/name-key';

const fit = (stem: string, suffix: string): string => `${stem.slice(0, MAX_NAME_LENGTH - suffix.length)}${suffix}`;

const freeName = (taken: readonly string[], stem: string): string => {
  const keys = new Set(taken.map(nameKey));
  const candidates = Array.from({ length: taken.length + 1 }, (_, index) => fit(stem, index === 0 ? '' : ` ${index + 1}`));
  return candidates.find((candidate) => !keys.has(nameKey(candidate))) ?? stem;
};

export { freeName };
