/* @layer renderer-app @kind component */
import { Button, Flex, Stack } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import type { PreviewFrame } from '../../../asset-overview/asset-overview.type';
import { PixelCanvas } from './PixelCanvas';

const FramePreview = ({ frames, name }: { readonly frames: readonly PreviewFrame[]; readonly name: string }) => {
  const [at, setAt] = useState(0);
  const shown = frames[Math.min(at, frames.length - 1)];
  if (!shown) return null;
  return (
    <Stack gap="sm">
      <PixelCanvas image={shown.image} label={OVERVIEW_TEXT.previewLabel(name)} />
      {frames.length > 1 && (
        <Flex gap="xs" wrap role="group" aria-label={OVERVIEW_TEXT.framesGroup}>
          {frames.map((frame, index) => (
            <Button
              key={frame.id}
              size="sm"
              variant={index === at ? 'primary' : 'secondary'}
              aria-pressed={index === at}
              aria-label={OVERVIEW_TEXT.frameLabel(index + 1, frame.durationMs)}
              onClick={() => setAt(index)}
            >
              <PixelCanvas image={frame.image} label="" small />
            </Button>
          ))}
        </Flex>
      )}
    </Stack>
  );
};

export { FramePreview };
