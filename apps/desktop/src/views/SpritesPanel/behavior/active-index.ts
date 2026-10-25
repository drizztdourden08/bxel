/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { FolderGroup } from '../../../sheet-manager/folders.type';

const activeIndex = (groups: readonly FolderGroup[], activeId: SpriteId | null): number =>
  groups.flatMap((group) => group.facts).findIndex((fact) => fact.sprite.id === activeId);

export { activeIndex };
