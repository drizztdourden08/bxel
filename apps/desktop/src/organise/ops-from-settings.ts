/* @layer renderer-app @kind logic */
import type { LegacyOrganise } from '../project-browser/project-browser.type';
import { toSlashes } from '../workspace/to-slashes';
import type { OrganiseOp } from './organise.type';

const opsFromSettings = (legacy: LegacyOrganise, paths: ReadonlyMap<string, string>): readonly OrganiseOp[] => {
  const byPath = new Map([...paths].map(([id, path]) => [toSlashes(path).toLowerCase(), id] as const));
  const pinned = legacy.pinned.flatMap((path) => byPath.get(toSlashes(path).toLowerCase()) ?? []);
  return [
    ...(pinned.length === 0 ? [] : [{ op: 'pin', assets: pinned } as const]),
    ...legacy.smart.map((filter) => ({ op: 'saveSearch', name: filter.name, query: filter.query }) as const),
  ];
};

export { opsFromSettings };
