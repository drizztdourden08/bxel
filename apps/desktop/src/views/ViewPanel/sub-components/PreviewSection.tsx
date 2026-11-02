/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, SegmentedControl, Toggle } from '@drizztdourden08/tessera';
import { PREVIEW_SCALES } from '../../../stores/preview-store.constants';
import { usePreviewStore } from '../../../stores/usePreviewStore';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { togglePlayback } from '../../../timeline/toggle-playback';
import { previewScaleOf } from '../behavior/preview-scale-of';
import { PREVIEW_TEXT } from '../ViewPanel.constants';
import { PreviewCanvas } from './PreviewCanvas';

const PreviewSection = () => {
  const scale = usePreviewStore((state) => state.scale);
  const onCanvas = usePreviewStore((state) => state.onCanvas);
  const setScale = usePreviewStore((state) => state.setScale);
  const setOnCanvas = usePreviewStore((state) => state.setOnCanvas);
  const playing = useTimelineStore((state) => state.playing);
  return (
    <Flex direction="column" gap="xs">
      <PreviewCanvas scale={scale} />
      <Flex gap="xs" align="center">
        <IconButton label={playing ? PREVIEW_TEXT.pause : PREVIEW_TEXT.play} size="sm" variant="tertiary" onClick={togglePlayback}>
          <Icon name={playing ? 'pixel-pause' : 'pixel-play'} size={14} />
        </IconButton>
        <SegmentedControl
          size="sm"
          label={PREVIEW_TEXT.scale}
          value={String(scale)}
          options={PREVIEW_SCALES.map((each) => ({ value: String(each), label: `${each}x` }))}
          onChange={(value) => setScale(previewScaleOf(value))}
        />
      </Flex>
      <Toggle size="sm" label={PREVIEW_TEXT.onCanvas} checked={onCanvas} onChange={setOnCanvas} />
    </Flex>
  );
};

export { PreviewSection };
