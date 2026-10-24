/* @layer renderer-app @kind logic */
import type { LayerId, SpriteId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { listSprites } from '../sheet/list-sprites';
import type { EditorTarget } from './editor.type';
import { spriteTarget } from './sprite-target';

const activeTarget = (view: DocumentView | null, layerId: LayerId | null = null, spriteId: SpriteId | null = null): EditorTarget | null => {
  if (!view) return null;
  const sprites = listSprites(view.state.artwork);
  const sprite = sprites.find((each) => each.id === spriteId) ?? sprites[0];
  return sprite ? spriteTarget(view, sprite, layerId) : null;
};

export { activeTarget };
