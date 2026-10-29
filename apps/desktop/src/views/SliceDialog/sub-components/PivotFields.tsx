/* @layer renderer-app @kind component */
import { ANCHOR_HALVES, ANCHOR_NAMES } from '@bxel/raster';
import { AnchorPicker, Field, Flex, NumberInput, Toggle } from '@drizztdourden08/tessera';
import { SLICE_DIALOG_TEXT } from '../SliceDialog.constants';
import type { SliceFieldsProps } from '../SliceDialog.type';

const PivotFields = ({ model }: SliceFieldsProps) => {
  const { form, update } = model;
  const { rect, pivot } = form;
  const preset = ANCHOR_NAMES.find((name) => pivot.x2 === ANCHOR_HALVES[name].x * rect.width && pivot.y2 === ANCHOR_HALVES[name].y * rect.height);
  return (
    <Flex gap="md" align="end" wrap>
      <Toggle size="sm" label={SLICE_DIALOG_TEXT.pivotOn} checked={form.pivotOn} onChange={(pivotOn) => update({ pivotOn })} />
      <AnchorPicker
        size="xs"
        label={SLICE_DIALOG_TEXT.pivot}
        customLabel={SLICE_DIALOG_TEXT.pivotCustom}
        value={preset ?? 'custom'}
        disabled={!form.pivotOn}
        onChange={(anchor) => update({ pivot: { x2: ANCHOR_HALVES[anchor].x * rect.width, y2: ANCHOR_HALVES[anchor].y * rect.height } })}
      />
      <Field label={SLICE_DIALOG_TEXT.pivotX}>
        <NumberInput size="sm" sizeToContent min={0} step={0.5} disabled={!form.pivotOn} value={pivot.x2 / 2} onChange={(x) => update({ pivot: { ...pivot, x2: Math.round(x * 2) } })} />
      </Field>
      <Field label={SLICE_DIALOG_TEXT.pivotY}>
        <NumberInput size="sm" sizeToContent min={0} step={0.5} disabled={!form.pivotOn} value={pivot.y2 / 2} onChange={(y) => update({ pivot: { ...pivot, y2: Math.round(y * 2) } })} />
      </Field>
    </Flex>
  );
};

export { PivotFields };
