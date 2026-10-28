/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';
import type { FolderGroup } from './folders.type';
import type { AnimationFacts, SpriteFacts } from './manager.type';

interface ManagerLists {
  facts: SpriteFacts[];
  twins: ReadonlySet<SpriteId>;
  shown: SpriteFacts[];
  animationFacts: AnimationFacts[];
  animations: AnimationFacts[];
  groups: FolderGroup[];
  order: SpriteId[];
  library: { sprites: SpriteFacts[]; animations: AnimationFacts[] };
}

export type { ManagerLists };
