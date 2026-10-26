/* @layer renderer-app @kind logic */
import { animationSequence } from '@bxel/document';
import type { AnimTag, Animation, Artwork, Sprite } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { animationFor } from './animation-for';
import { hiddenAssets } from './hidden-assets';
import { reply } from './reply';
import type { GetAnimationInput } from './tool-input.type';
import { viewFor } from './view-for';

const frameEntry = (sprites: ReadonlyMap<string, Sprite>) => (frame: Animation['frames'][number], index: number) => ({
  frameId: frame.id,
  index,
  spriteId: frame.spriteId,
  owned: frame.spriteId !== null && sprites.get(frame.spriteId)?.role === 'frame',
  clip: frame.clip,
  durationMs: frame.durationMs,
  offset: frame.offset,
  pivot: frame.pivot,
});

const indexOf = (animation: Animation, frameId: string): number => Math.max(0, animation.frames.findIndex((frame) => frame.id === frameId));

const tagEntry = (animation: Animation) => (tag: AnimTag) =>
  tag.kind === 'span'
    ? {
        kind: 'span' as const,
        tagId: tag.id,
        name: tag.name,
        from: indexOf(animation, tag.from),
        to: indexOf(animation, tag.to),
        direction: tag.direction,
        repeat: tag.repeat,
        ...(tag.facing === undefined ? {} : { facing: tag.facing }),
        ...(tag.colour === undefined ? {} : { colour: tag.colour }),
      }
    : { kind: 'mirror' as const, tagId: tag.id, of: tag.of, flip: tag.flip, facing: tag.facing };

const usersOf = (artwork: Artwork, animation: Animation) => ({
  sheets: artwork.sheets.filter((sheet) => sheet.animationEntries?.some((entry) => entry.animationId === animation.id)).map((sheet) => sheet.id),
  tilesets: artwork.tilesets.flatMap((tileset) => {
    const keys = tileset.tiles.filter((tile) => tile.animation?.animationId === animation.id).map((tile) => tile.key);
    return keys.length > 0 ? [{ tilesetId: tileset.id, keys }] : [];
  }),
});

const getAnimation: ToolHandler = (input, context) => {
  const { documentId, animationId } = input as GetAnimationInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const { artwork, revision } = view.state;
  const found = animationFor(artwork, animationId, hiddenAssets(context, documentId));
  if (!found.ok) return reply(found);
  const animation = found.value;
  const sprites = new Map(artwork.sprites.map((sprite) => [sprite.id as string, sprite] as const));
  return reply({
    ok: true,
    revision,
    animationId: animation.id,
    name: animation.name,
    width: animation.width,
    height: animation.height,
    bankId: animation.bankId,
    anchor: animation.anchor,
    loop: animation.loop,
    directions: animation.directions,
    cycleMs: animationSequence(animation, null).cycleMs,
    frames: animation.frames.map(frameEntry(sprites)),
    tags: animation.tags.map(tagEntry(animation)),
    usedBy: usersOf(artwork, animation),
  });
};

export { getAnimation };
