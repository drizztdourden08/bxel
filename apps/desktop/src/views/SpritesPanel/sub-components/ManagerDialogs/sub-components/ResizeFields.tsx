/* @layer renderer-app @kind component */
import { AnchorPicker, Stack } from '@drizztdourden08/tessera';
import { MAX_SPRITE_SIZE, MIN_SPRITE_SIZE } from '@bxel/document';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import type { ResizeFieldsProps } from '../ManagerDialogs.type';
import { NumberPair } from './NumberPair';

const ResizeFields = ({ spec, update }: ResizeFieldsProps) => (
  <Stack gap="sm">
    <NumberPair
      first={{ label: DIALOG_TEXT.width, value: spec.width, onChange: (width) => update({ width }) }}
      second={{ label: DIALOG_TEXT.height, value: spec.height, onChange: (height) => update({ height }) }}
      min={MIN_SPRITE_SIZE}
      max={MAX_SPRITE_SIZE}
      step={1}
    />
    <AnchorPicker label={DIALOG_TEXT.anchor} variant="arrows" value={spec.anchor} onChange={(anchor) => update({ anchor })} />
  </Stack>
);

export { ResizeFields };
