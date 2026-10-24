/* @layer renderer-app @kind component */
import { Canvas, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { diffImage } from '../../../../../sheet-manager/diff-image';
import { IDENTICAL_TEXT } from '../../../../../sheet-manager/identical-text.constants';
import { spriteImage } from '../../../../../sheet/sprite-image';
import { useImageCanvas } from '../../../behavior/useImageCanvas';
import type { CompareDiffProps } from '../../../../../sheet-manager/dialog-form.type';
import { COMPARE_BOX } from '../ManagerDialogs.constants';

const CompareDiff = ({ artwork, first, second }: CompareDiffProps) => {
  const image = useMemo(() => {
    const a = spriteImage(artwork, first);
    const b = spriteImage(artwork, second);
    if (!a || !b) return null;
    return a.width === b.width && a.height === b.height ? diffImage(a, b) : null;
  }, [artwork, first, second]);
  const canvas = useImageCanvas(image, COMPARE_BOX);
  return (
    <Stack gap="2xs" align="center">
      <Canvas ref={canvas} className="sprites-panel__thumb" aria-hidden="true" />
      <Text variant="label">{IDENTICAL_TEXT.difference}</Text>
    </Stack>
  );
};

export { CompareDiff };
