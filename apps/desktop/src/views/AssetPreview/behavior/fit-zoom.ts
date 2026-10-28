/* @layer renderer-app @kind logic */
import type { StageSize } from '../AssetPreview.type';

const FRAME_PADDING = 16;

/** The largest whole-number zoom that keeps the image inside the stage; never below 1. */
const fitZoom = (stage: StageSize, width: number, height: number): number => {
  if (width < 1 || height < 1 || stage.width < 1 || stage.height < 1) return 1;
  const across = Math.floor((stage.width - FRAME_PADDING) / width);
  const down = Math.floor((stage.height - FRAME_PADDING) / height);
  return Math.max(1, Math.min(across, down));
};

export { fitZoom };
