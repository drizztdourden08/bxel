/* @layer renderer-app @kind component */
import { Box, Icon, IconButton, SegmentedControl, Text } from '@drizztdourden08/tessera';
import { PREVIEW_TEXT, SPEED_OPTIONS } from '../../../asset-preview/asset-preview.constants';
import type { PlaybackModel, PlaybackSpeed } from '../../../asset-preview/asset-preview.type';
import type { PlaybackBarProps } from '../AssetPreview.type';

const playLabel = (playback: PlaybackModel): string => {
  if (playback.playing) return PREVIEW_TEXT.pause;
  return playback.finished ? PREVIEW_TEXT.replay : PREVIEW_TEXT.play;
};

const PlaybackBar = ({ playback, total, loop }: PlaybackBarProps) => (
  <Box className="asset-preview__bar" role="group" aria-label={PREVIEW_TEXT.controls}>
    <IconButton label={PREVIEW_TEXT.stepBack} size="sm" variant="tertiary" onClick={() => playback.step(-1)}>
      <Icon name="pixel-frame-prev" />
    </IconButton>
    <IconButton
      label={playLabel(playback)}
      size="sm"
      variant="primary"
      onClick={playback.playing ? playback.pause : playback.play}
    >
      <Icon name={playback.playing ? 'pixel-pause' : 'pixel-play'} />
    </IconButton>
    <IconButton label={PREVIEW_TEXT.stepForward} size="sm" variant="tertiary" onClick={() => playback.step(1)}>
      <Icon name="pixel-frame-next" />
    </IconButton>
    <SegmentedControl<PlaybackSpeed> size="sm" label={PREVIEW_TEXT.speed} value={playback.speed} options={SPEED_OPTIONS} onChange={playback.setSpeed} />
    <Text as="span" variant="caption" tone="muted" className="asset-preview__counter" role="status" title={PREVIEW_TEXT.loop(loop)}>
      {PREVIEW_TEXT.frame(playback.shown, total)}
    </Text>
  </Box>
);

export { PlaybackBar };
