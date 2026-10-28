/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../../../editor/editor.type';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';

/** Names what the list belongs to: a sprite, a frame of an animation, or a tile. */
const ownerOf = ({ sprite, animation }: EditorTarget): string => {
  if (animation) {
    const index = animation.animation.frames.findIndex((frame) => frame.id === animation.frame.id);
    return LAYER_STACK_TEXT.frame(index + 1, animation.animation.name, sprite.name);
  }
  return sprite.role === 'tile' ? LAYER_STACK_TEXT.tile(sprite.name) : LAYER_STACK_TEXT.sprite(sprite.name);
};

export { ownerOf };
