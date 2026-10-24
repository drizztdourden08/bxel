/* @layer renderer-app @kind component */
import { Callout, Stack } from '@drizztdourden08/tessera';
import { PaletteFields } from '../../PaletteFields';
import type { StepProps } from '../ImportWizard.type';
import { ColorsCompare } from './ColorsCompare';
import { ColorsResult } from './ColorsResult';
import { QualityFields } from './QualityFields';
import { ReduceChoices } from './ReduceChoices';

const ColorsStep = ({ image, wizard }: StepProps) => {
  const { form, errors, colors, update } = wizard;
  const makesBank = form.target === 'new' || form.reduce === 'extract' || form.reduce === 'palette';
  return (
    <Stack gap="md">
      {colors.warning !== null && <Callout tone="warning">{colors.warning}</Callout>}
      <ColorsCompare image={image} wizard={wizard} />
      <ReduceChoices wizard={wizard} />
      {makesBank && (
        <PaletteFields
          value={{ source: form.source, limit: form.limit, transparent: form.transparent }}
          limitError={errors.limit}
          paletteError={errors.palette}
          withSource={form.reduce === 'palette'}
          onChange={update}
        />
      )}
      <QualityFields wizard={wizard} />
      <ColorsResult wizard={wizard} />
    </Stack>
  );
};

export { ColorsStep };
