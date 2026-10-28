/* @layer renderer-app @kind component */
import { animationSequence, findAnimation, tilePlayback, tileStepAt } from '@bxel/document';
import { Box, Button, Canvas, EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { composedImage } from '../../../timeline/composed-image';
import { animationFromTile } from '../../../tile-animation/animation-from-tile';
import { animationFileName } from '../../../tile-animation/animation-file-name';
import { subscribeTileClock } from '../../../tile-animation/tile-clock';
import { openAnimationAt } from '../../../timeline/open-animation-at';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { EmptyTimeline } from './EmptyTimeline';

const TileThumb = ({ artwork, animation, frameId }: { artwork: Parameters<typeof composedImage>[0]; animation: Parameters<typeof composedImage>[1]; frameId: string }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    const image = composedImage(artwork, animation, frameId as never);
    context?.clearRect(0, 0, animation.width, animation.height);
    if (image) context?.putImageData(image, 0, 0);
  }, [artwork, animation, frameId]);
  return <Canvas ref={canvas} className="tile-timeline__thumb" width={animation.width} height={animation.height} aria-hidden="true" />;
};

const TileTimeline = () => {
  const context = useMapContext();
  const editKey = useTilemapStore((state) => state.editKey);
  const tileset = context?.tileset ?? null;
  const tile = tileset?.tiles.find((each) => each.key === editKey);
  const link = tile?.animation ?? null;
  const animation = context && link ? findAnimation(context.artwork, link.animationId) : undefined;
  const sequence = useMemo(() => (animation ? animationSequence(animation, link?.tagId ?? null) : null), [animation, link?.tagId]);
  const [playing, setPlaying] = useState(0);
  useEffect(() => {
    if (!context || !tileset || !tile) return undefined;
    const playback = tilePlayback(context.artwork, tileset, tile);
    return playback ? subscribeTileClock((now) => setPlaying(tileStepAt(playback, now))) : undefined;
  }, [context, tileset, tile]);
  if (!context || !tileset || !tile) return <EmptyTimeline />;
  if (!animation || !link || !sequence) {
    return (
      <EmptyState
        size="sm"
        title={TIMELINE_PANEL_TEXT.tileStill}
        message=""
        action={
          <Button variant="primary" size="sm" onClick={() => animationFromTile(context.artwork, tileset, tile)}>
            {TIMELINE_PANEL_TEXT.tileNew}
          </Button>
        }
      />
    );
  }
  const spanTag = animation.tags.find((tag) => tag.id === link.tagId);
  const tagName = spanTag?.kind === 'span' ? TIMELINE_PANEL_TEXT.tileTag(spanTag.name) : TIMELINE_PANEL_TEXT.tileWhole;
  const lit = sequence.steps[playing]?.frameId;
  return (
    <Stack gap="sm" className="tile-timeline" role="group" aria-label={TIMELINE_PANEL_TEXT.tileFrames}>
      <Flex gap="sm" align="center" wrap>
        <Text variant="caption" role="status">
          {TIMELINE_PANEL_TEXT.tilePlays(tile.key, animationFileName(animation), tagName, TIMELINE_PANEL_TEXT.tileStart[link.start])}
        </Text>
        <Button size="sm" variant="secondary" onClick={() => openAnimationAt(animation.id, null, link.tagId)}>
          {TIMELINE_PANEL_TEXT.tileEdit}
        </Button>
      </Flex>
      <Box role="list" className="tile-timeline__strip">
        {sequence.steps.map((step, index) => (
          <Box key={`${step.frameId}:${index}`} role="listitem" className="tile-timeline__frame" data-lit={step.frameId === lit && index === playing ? 'yes' : 'no'}>
            <TileThumb artwork={context.artwork} animation={animation} frameId={step.frameId} />
            <Text as="span" variant="caption" tone="muted" numeric>{`${index + 1}  ${step.durationMs}`}</Text>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export { TileTimeline };
