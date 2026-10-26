/* @layer renderer-app @kind component */
import { animationSequence, findAnimation, tileAnimationIssue } from '@bxel/document';
import type { TagId, TileAnimationStart } from '@bxel/document';
import { Button, Flex, Select, Stack, Text } from '@drizztdourden08/tessera';
import { openAnimation } from '../../../timeline/open-animation';
import { animationFileName } from '../../../tile-animation/animation-file-name';
import { detachTile, linkTile } from '../../../tile-animation/tile-animation-actions';
import { TILE_ANIMATION_TEXT, WHOLE_TAG } from '../../../tile-animation/tile-animation.constants';
import type { AnimationPartProps } from '../TilesetPanel.type';
import { AnimationChoose } from './AnimationChoose';
import { AnimationPreview } from './AnimationPreview';

const START_OPTIONS = [
  { value: 'together', label: TILE_ANIMATION_TEXT.together },
  { value: 'random', label: TILE_ANIMATION_TEXT.random },
] as const;

const AnimationLinked = (props: AnimationPartProps) => {
  const { artwork, tileset, tile } = props;
  const link = tile.animation;
  const animation = link ? findAnimation(artwork, link.animationId) : undefined;
  if (!link || !animation) return null;
  const issue = tileAnimationIssue(artwork, tileset, tile);
  const { steps, cycleMs } = animationSequence(animation, link.tagId);
  const change = (next: { readonly tag?: TagId | null; readonly start?: TileAnimationStart }): void => {
    linkTile(tileset, tile.key, { animation: animation.id, tag: next.tag === undefined ? link.tagId : next.tag, start: next.start ?? link.start });
  };
  const spans = animation.tags.flatMap((tag) => (tag.kind === 'span' ? [{ value: tag.id as string, label: tag.name }] : []));
  return (
    <Stack gap="xs">
      {issue === null ? <AnimationPreview {...props} /> : null}
      <Text variant="caption" tone={issue === null ? 'muted' : 'danger'}>
        {issue === null
          ? TILE_ANIMATION_TEXT.plays(animation.name, animationFileName(animation), steps.length, cycleMs)
          : TILE_ANIMATION_TEXT.broken(issue)}
      </Text>
      <Flex gap="xs" align="center" wrap>
        <Select
          size="sm"
          aria-label={TILE_ANIMATION_TEXT.tag}
          options={[{ value: WHOLE_TAG, label: TILE_ANIMATION_TEXT.wholeAnimation }, ...spans]}
          value={link.tagId ?? WHOLE_TAG}
          onChange={(value) => change({ tag: value === WHOLE_TAG ? null : (value as TagId) })}
        />
        <Select
          size="sm"
          aria-label={TILE_ANIMATION_TEXT.start}
          options={[...START_OPTIONS]}
          value={link.start}
          onChange={(value) => change({ start: value as TileAnimationStart })}
        />
      </Flex>
      <AnimationChoose {...props} />
      <Flex gap="xs" align="center" wrap>
        <Button size="sm" variant="secondary" onClick={() => openAnimation(animation.id)}>
          {TILE_ANIMATION_TEXT.edit}
        </Button>
        <Button size="sm" variant="tertiary" onClick={() => detachTile(tileset, tile.key)}>
          {TILE_ANIMATION_TEXT.detach}
        </Button>
      </Flex>
    </Stack>
  );
};

export { AnimationLinked };
