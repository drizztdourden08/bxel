/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { PendingOutcome } from '../../../editor/pending/pending.type';

const usePendingImage = (outcome: PendingOutcome | null): ImageData | null =>
  useMemo(() => {
    const frame = outcome?.frame;
    return frame ? new ImageData(frame.rgba, frame.width, frame.height) : null;
  }, [outcome]);

export { usePendingImage };
