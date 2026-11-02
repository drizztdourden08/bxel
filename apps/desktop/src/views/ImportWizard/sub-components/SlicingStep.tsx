/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { slicingText } from '../../../image-import/slicing-text';
import type { StepProps } from '../ImportWizard.type';
import { SliceFields } from './SliceFields';
import { SlicePreview } from './SlicePreview';

const SlicingStep = ({ image, wizard }: StepProps) => (
  <Stack gap="md">
    <SlicePreview image={image} rects={wizard.rects} />
    <SliceFields wizard={wizard} />
    {wizard.errors.slice === null && (
      <Text aria-live="polite">{slicingText(wizard.form.kind, wizard.names, wizard.rects)}</Text>
    )}
  </Stack>
);

export { SlicingStep };
