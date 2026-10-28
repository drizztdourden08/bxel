/* @layer renderer-app @kind logic */
import { FRAME_PADDING } from '../../../asset-preview/asset-preview.constants';
import type { StageSize } from '../AssetPreview.type';

const fitZoom = (stage: StageSize, width: number, height: number): number => {
  if (width < 1 || height < 1 || stage.width < 1 || stage.height < 1) return 1;
  const across = Math.floor((stage.width - FRAME_PADDING) / width);
  const down = Math.floor((stage.height - FRAME_PADDING) / height);
  return Math.max(1, Math.min(across, down));
};

export { fitZoom };
