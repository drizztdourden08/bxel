/* @layer core @kind logic */
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import { pathSegments } from '../paths/path-segments';

const sharedCount = (from: readonly string[], to: readonly string[]): number => {
  let count = 0;
  while (count < from.length && from[count]?.toLowerCase() === to[count]?.toLowerCase()) count += 1;
  return count;
};

const relativePath = (fromNormalized: string, toNormalized: string): string => {
  const from = pathSegments(fromNormalized);
  const to = pathSegments(toNormalized);
  const shared = sharedCount(from, to);
  const climb = Array.from({ length: from.length - shared }, () => '..');
  const relative = [...climb, ...to.slice(shared)].join('/');
  return relative === '' ? ROOT_FOLDER_PATH : relative;
};

export { relativePath };
