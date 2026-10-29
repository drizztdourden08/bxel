/* @layer renderer-app @kind component */
import { animationSequence, findAnimation, tilePlayback, tileStepAt } from '@bxel/document';
import { Box, Button, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useEffect, useMemo, useState } from 'react';
import { animationFileName } from '../../../tile-animation/animation-file-name';
import { subscribeTileClock } from '../../../tile-animation/tile-clock';
import { openAnimationAt } from '../../../timeline/open-animation-at';
import { tileTagName } from '../behavior/tile-tag-name';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import { TileStill } from './TileStill';
import type { TileAnimationProps } from './TileAnimation.type';
import { TileThumb } from './TileThumb';

const TileAnimation = ({ artwork, tileset, tile }: TileAnimationProps) => {
  const link = tile.animation ?? null;
  const animation = link ? findAnimation(artwork, link.animationId) : undefined;
  const sequence = useMemo(() => (animation ? animationSequence(animation, link?.tagId ?? null) : null), [animation, link?.tagId]);
  const [playing, setPlaying] = useState(0);
  useEffect(() => {
    const playback = tilePlayback(artwork, tileset, tile);
    return playback ? subscribeTileClock((now) => setPlaying(tileStepAt(playback, now))) : undefined;
  }, [artwork, tileset, tile]);
  if (!animation || !link || !sequence) return <TileStill artwork={artwork} tileset={tileset} tile={tile} />;
  const lit = sequence.steps[playing]?.frameId;
  return (
    <Stack gap="sm" className="tile-timeline" role="group" aria-label={TIMELINE_PANEL_TEXT.tileFrames}>
      <Flex gap="sm" align="center" wrap>
        <Text variant="caption" role="status">
          {TIMELINE_PANEL_TEXT.tilePlays(tile.key, animationFileName(animation), tileTagName(animation, link.tagId), TIMELINE_PANEL_TEXT.tileStart[link.start])}
        </Text>
        <Button size="sm" variant="secondary" onClick={() => openAnimationAt(animation.id, null, link.tagId)}>
          {TIMELINE_PANEL_TEXT.tileEdit}
        </Button>
      </Flex>
      <Box role="list" className="tile-timeline__strip">
        {sequence.steps.map((step, index) => (
          <Box key={`${step.frameId}:${index}`} role="listitem" className="tile-timeline__frame" data-lit={step.frameId === lit && index === playing ? 'yes' : 'no'}>
            <TileThumb artwork={artwork} animation={animation} frameId={step.frameId} />
            <Text as="span" variant="caption" tone="muted" numeric>{`${index + 1}  ${step.durationMs}`}</Text>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export { TileAnimation };
