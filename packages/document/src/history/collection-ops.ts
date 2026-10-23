/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import { COLLECTION_KEYS, COLLECTION_PREFIX, META_PATH } from './entity-path.constants';
import type { ProjectMeta, UndoOp } from './history.type';

const sameList = (first: readonly unknown[], second: readonly unknown[]): boolean =>
  first.length === second.length && first.every((item, index) => item === second[index]);

const metaOf = (project: Project): ProjectMeta => ({
  name: project.name,
  defaultBankId: project.defaultBankId,
  coverSpriteId: project.coverSpriteId,
});

const metaOps = (base: Project, next: Project): UndoOp[] => {
  const before = metaOf(base);
  const after = metaOf(next);
  const same =
    before.name === after.name &&
    before.defaultBankId === after.defaultBankId &&
    before.coverSpriteId === after.coverSpriteId;
  return same ? [] : [{ kind: 'entity', path: META_PATH, before, after }];
};

const collectionOps = (base: Project, next: Project): UndoOp[] => [
  ...metaOps(base, next),
  ...COLLECTION_KEYS.flatMap((key): UndoOp[] =>
    sameList(base[key], next[key])
      ? []
      : [{ kind: 'entity', path: `${COLLECTION_PREFIX}${key}`, before: base[key], after: next[key] }],
  ),
];

export { collectionOps };
