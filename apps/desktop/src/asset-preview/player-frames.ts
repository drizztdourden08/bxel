/* @layer renderer-app @kind logic */
import type { PixelThumbnailFrame } from '@drizztdourden08/tessera';
import type { PreviewFrame } from '../asset-overview/asset-overview.type';
import { rgbaOf } from './rgba-of';

const playerFrames = (frames: readonly PreviewFrame[]): readonly PixelThumbnailFrame[] => frames.map((frame) => ({ image: rgbaOf(frame.image), durationMs: frame.durationMs }));

export { playerFrames };
