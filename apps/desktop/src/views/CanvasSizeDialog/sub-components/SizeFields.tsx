/* @layer renderer-app @kind component */
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '@bxel/document';
import { AnchorPicker, Field, Flex, NumberInput, Stack } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { SizeFieldsProps } from '../CanvasSizeDialog.type';

const SizeFields = ({ spec, update }: SizeFieldsProps) => (
  <Stack gap="md">
    <Flex gap="md" align="end">
      <Field label={DIALOG_TEXT.width}>
        <NumberInput size="sm" sizeToContent min={MIN_SPRITE_SIZE} max={MAX_SPRITE_SIZE} value={spec.width} onChange={(width) => update({ width })} />
      </Field>
      <Field label={DIALOG_TEXT.height}>
        <NumberInput size="sm" sizeToContent min={MIN_SPRITE_SIZE} max={MAX_SPRITE_SIZE} value={spec.height} onChange={(height) => update({ height })} />
      </Field>
    </Flex>
    <AnchorPicker label={DIALOG_TEXT.anchor} variant="arrows" value={spec.anchor} onChange={(anchor) => update({ anchor })} />
  </Stack>
);

export { SizeFields };
