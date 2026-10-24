/* @layer renderer-app @kind component */
import { Button, Callout, Stack } from '@drizztdourden08/tessera';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import { FitDialog } from '../../FitDialog';
import { useChangeDialog } from '../behavior/useChangeDialog';
import type { ChangeDialogProps } from '../PaletteChangeDialog.type';
import { LimitBody } from './LimitBody';
import { SwatchBody } from './SwatchBody';

const ChangeDialog = ({ request }: ChangeDialogProps) => {
  const state = useChangeDialog(request);
  const { preview, error, failure, apply, cancel } = state;
  const label = request.kind === 'limit' ? CHANGE_TEXT.apply.limit() : CHANGE_TEXT.apply[request.kind](preview?.pixels ?? 0);
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
    <FitDialog open title={CHANGE_TEXT.titles[request.kind]} onClose={cancel} actions={actions} className="change-dialog">
      <Stack gap="md">
        {request.kind === 'limit' ? <LimitBody request={request} state={state} /> : <SwatchBody request={request} state={state} />}
        {error !== null && <Callout tone="warning">{error}</Callout>}
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
      </Stack>
    </FitDialog>
  );
};

export { ChangeDialog };
