/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { FolderGroup } from './folders.type';

const visibleOrder = (groups: readonly FolderGroup[]): SpriteId[] =>
  groups.filter((group) => !group.hidden && !group.closed).flatMap((group) => group.facts.map((fact) => fact.sprite.id));

export { visibleOrder };
