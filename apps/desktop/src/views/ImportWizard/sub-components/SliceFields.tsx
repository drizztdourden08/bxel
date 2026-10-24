/* @layer renderer-app @kind component */
import { Field, SegmentedControl, Stack, TextInput } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { SIZE_RANGE } from '../../../sprite-name/sprite-name.constants';
import { OFFSET_MAX, ORDER_OPTIONS } from '../ImportWizard.constants';
import type { WizardActionsProps } from '../ImportWizard.type';
import { PairField } from './PairField';

const SliceFields = ({ wizard }: WizardActionsProps) => {
  const { form, errors, setSlice } = wizard;
  const { slice } = form;
  return (
    <Stack gap="sm">
      <PairField
        label={IMPORT_TEXT.cell}
        x={slice.cellWidth}
        y={slice.cellHeight}
        min={SIZE_RANGE.min}
        max={SIZE_RANGE.max}
        error={errors.slice ?? undefined}
        onX={(cellWidth) => setSlice({ cellWidth })}
        onY={(cellHeight) => setSlice({ cellHeight })}
      />
      <PairField
        label={IMPORT_TEXT.offset}
        x={slice.offsetX}
        y={slice.offsetY}
        min={0}
        max={OFFSET_MAX}
        onX={(offsetX) => setSlice({ offsetX })}
        onY={(offsetY) => setSlice({ offsetY })}
      />
      <PairField
        label={IMPORT_TEXT.spacing}
        x={slice.spacingX}
        y={slice.spacingY}
        min={0}
        max={OFFSET_MAX}
        onX={(spacingX) => setSlice({ spacingX })}
        onY={(spacingY) => setSlice({ spacingY })}
      />
      <Field label={IMPORT_TEXT.order}>
        <SegmentedControl size="sm" aria-label={IMPORT_TEXT.order} value={slice.order} options={ORDER_OPTIONS} onChange={(order) => setSlice({ order })} />
      </Field>
      <Field label={IMPORT_TEXT.names} hint={IMPORT_TEXT.namesHint} error={errors.naming ?? undefined}>
        <TextInput value={slice.names} onChange={(event) => setSlice({ names: event.target.value })} />
      </Field>
    </Stack>
  );
};

export { SliceFields };
