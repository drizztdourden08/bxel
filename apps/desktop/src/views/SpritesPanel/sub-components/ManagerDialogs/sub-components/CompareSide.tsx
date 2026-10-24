/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { IDENTICAL_TEXT } from '../../../../../sheet-manager/identical-text.constants';
import { pivotLabel } from '../../../../../sheet-manager/pivot-label';
import { COMPARE_BOX } from '../ManagerDialogs.constants';
import type { CompareSideProps } from '../../../../../sheet-manager/dialog-form.type';
import { SpriteThumb } from '../../SpriteThumb';

const CompareSide = ({ artwork, sprite }: CompareSideProps) => (
  <Stack gap="2xs" align="center">
    <SpriteThumb artwork={artwork} sprite={sprite} box={COMPARE_BOX} />
    <Text variant="label">{sprite.name}</Text>
    <Text variant="caption" tone="dim">
      {`${IDENTICAL_TEXT.sizeLine(sprite.width, sprite.height)}, ${IDENTICAL_TEXT.frameLine(sprite.frames.length)}`}
    </Text>
    <Text variant="caption" tone="dim">
      {IDENTICAL_TEXT.pivotLine(pivotLabel(sprite))}
    </Text>
  </Stack>
);

export { CompareSide };
