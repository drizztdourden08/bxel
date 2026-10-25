/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';
import type { SpriteFacts } from './manager.type';

interface FolderGroup {
  path: string;
  depth: number;
  facts: readonly SpriteFacts[];
  closed: boolean;
  hidden: boolean;
}

interface SavedSelection {
  name: string;
  ids: readonly SpriteId[];
}

interface ListItem {
  key: string;
  group: FolderGroup | null;
  fact: SpriteFacts | null;
}

export type { FolderGroup, ListItem, SavedSelection };
