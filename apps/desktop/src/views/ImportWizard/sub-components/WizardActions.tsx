/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { advanceLabel } from '../../../image-import/advance-label';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import type { WizardActionsProps } from '../ImportWizard.type';

const WizardActions = ({ wizard }: WizardActionsProps) => (
  <>
    {wizard.step !== wizard.steps[0] && (
      <Button variant="tertiary" onClick={wizard.back}>
        {IMPORT_TEXT.back}
      </Button>
    )}
    <Button variant="tertiary" onClick={wizard.cancel}>
      {IMPORT_TEXT.cancel}
    </Button>
    <Button variant="primary" disabled={wizard.issue !== null} onClick={wizard.advance}>
      {advanceLabel(wizard.step, wizard.steps, wizard.names.length)}
    </Button>
  </>
);

export { WizardActions };
