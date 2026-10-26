/* @layer renderer-app @kind logic */
import type { FrameId, LayerId, Sprite, SpriteId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { listSprites } from '../sheet/list-sprites';
import type { EditorTarget } from './editor.type';
import { spriteTarget } from './sprite-target';

const pickSprite = (view: DocumentView, spriteId: SpriteId | null): Sprite | undefined => {
  const sprites = listSprites(view.state.artwork);
  const owned = view.state.artwork.sprites.find((each) => each.id === spriteId && each.role !== 'sprite');
  return owned ?? sprites.find((each) => each.id === spriteId) ?? sprites[0];
};

const activeTarget = (
  view: DocumentView | null,
  layerId: LayerId | null = null,
  spriteId: SpriteId | null = null,
  frameId: FrameId | null = null,
): EditorTarget | null => {
  if (!view) return null;
  const sprite = pickSprite(view, spriteId);
  return sprite ? spriteTarget(view, sprite, layerId, frameId) : null;
};

export { activeTarget };
