/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { slicingLine } from '../../../image-import/slicing-line';
import type { StepProps } from '../ImportWizard.type';
import { SliceFields } from './SliceFields';
import { SlicePreview } from './SlicePreview';

const SlicingStep = ({ image, wizard }: StepProps) => (
  <Stack gap="md">
    <SlicePreview image={image} rects={wizard.rects} />
    <SliceFields wizard={wizard} />
    {wizard.errors.slice === null && (
      <Text aria-live="polite">{slicingLine(wizard.names)}</Text>
    )}
  </Stack>
);

export { SlicingStep };
