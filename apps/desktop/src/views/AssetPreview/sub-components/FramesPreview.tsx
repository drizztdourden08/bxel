/* @layer renderer-app @kind component */
import { usePlayback } from '../../../asset-preview/usePlayback';
import type { FramesPreviewProps } from '../AssetPreview.type';
import { PixelStage } from './PixelStage';
import { PlaybackBar } from './PlaybackBar';

const FramesPreview = ({ frames, name, loop, mode }: FramesPreviewProps) => {
  const playback = usePlayback({ frames, loop });
  const shown = frames[playback.index] ?? frames[0];
  if (!shown) return null;
  return (
    <>
      <PixelStage image={shown.image} label={name} mode={mode} />
      {frames.length > 1 && <PlaybackBar playback={playback} total={frames.length} loop={loop} />}
    </>
  );
};

export { FramesPreview };
