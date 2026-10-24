/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Stack } from '@drizztdourden08/tessera';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import { useChangeDialog } from '../behavior/useChangeDialog';
import type { ChangeDialogProps } from '../PaletteChangeDialog.type';
import { ChangeBody } from './ChangeBody';

const ChangeDialog = ({ request }: ChangeDialogProps) => {
  const state = useChangeDialog(request);
  const { preview, error, failure, apply, cancel } = state;
  const label = CHANGE_TEXT.apply[request.kind](preview?.pixels ?? 0);
  const actions = (
    <>
      <Button variant="tertiary" onClick={cancel}>
        {CHANGE_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={error !== null} onClick={apply}>
        {label}
      </Button>
    </>
  );
  return (
    <DialogShell open title={CHANGE_TEXT.titles[request.kind]} onClose={cancel} actions={actions} className="change-dialog">
      <Stack gap="md">
        <ChangeBody request={request} state={state} />
        {error !== null && <Callout tone="warning">{error}</Callout>}
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { ChangeDialog };
