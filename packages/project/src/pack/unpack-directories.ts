/* @layer core @kind logic */
import type { FolderId } from '../ids/id.type';
import type { ExtractOperation, MkdirOperation } from './pack.type';

const parentOf = (path: string): string => path.slice(0, path.lastIndexOf('/'));

const unpackDirectories = (
  targets: ReadonlyMap<FolderId, string>,
  extracts: readonly ExtractOperation[],
): readonly MkdirOperation[] => {
  const all = new Set([...targets.values(), ...extracts.map((extract) => parentOf(extract.path))]);
  return [...all].sort().map((path) => ({ kind: 'mkdir', path }));
};

export { unpackDirectories };
