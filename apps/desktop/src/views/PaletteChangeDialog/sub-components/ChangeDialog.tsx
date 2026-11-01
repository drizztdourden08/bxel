/* @layer renderer-app @kind component */
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import { PlanActions } from '../../PaletteImportDialog/sub-components/PlanActions';
import { PlanDialog } from '../../PaletteImportDialog/sub-components/PlanDialog';
import { useChangeDialog } from '../behavior/useChangeDialog';
import type { ChangeDialogProps } from '../PaletteChangeDialog.type';
import { ChangeBody } from './ChangeBody';

const ChangeDialog = ({ request }: ChangeDialogProps) => {
  const state = useChangeDialog(request);
  const { preview, error, failure, apply, cancel } = state;
  const label = CHANGE_TEXT.apply[request.kind](preview?.pixels ?? 0);
  const actions = <PlanActions cancelLabel={CHANGE_TEXT.cancel} applyLabel={label} disabled={error !== null} onCancel={cancel} onApply={apply} />;
  return (
    <PlanDialog title={CHANGE_TEXT.titles[request.kind]} className="change-dialog" actions={actions} error={error} failure={failure} onClose={cancel}>
      <ChangeBody request={request} state={state} />
    </PlanDialog>
  );
};

export { ChangeDialog };
