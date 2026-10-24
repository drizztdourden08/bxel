/* @layer renderer-app @kind component */
import { Box, Callout, DialogShell, Stack } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { useImportWizard } from '../behavior/useImportWizard';
import type { ImportDialogProps } from '../ImportWizard.type';
import { ColorsStep } from './ColorsStep';
import { SlicingStep } from './SlicingStep';
import { SourceStep } from './SourceStep';
import { StepHeader } from './StepHeader';
import { WizardActions } from './WizardActions';

const ImportDialog = ({ image }: ImportDialogProps) => {
  const wizard = useImportWizard(image);
  const { step, failure, cancel } = wizard;
  return (
    <DialogShell
      open
      title={IMPORT_TEXT.title(image.fileName)}
      onClose={cancel}
      actions={<WizardActions wizard={wizard} />}
      className="import-wizard"
    >
      <Stack gap="md">
        <StepHeader wizard={wizard} />
        <Box>
          {step === 'source' && <SourceStep image={image} wizard={wizard} />}
          {step === 'colors' && <ColorsStep image={image} wizard={wizard} />}
          {step === 'slicing' && <SlicingStep image={image} wizard={wizard} />}
        </Box>
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { ImportDialog };
