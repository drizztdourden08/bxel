/* @layer renderer-app @kind component */
import { Stepper } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import type { WizardActionsProps } from '../ImportWizard.type';

const StepHeader = ({ wizard }: WizardActionsProps) => (
  <Stepper
    size="sm"
    label={IMPORT_TEXT.stepsLabel}
    currentId={wizard.step}
    steps={wizard.steps.map((id) => ({ id, label: IMPORT_TEXT.steps[id] }))}
  />
);

export { StepHeader };
