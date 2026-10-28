/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Stack } from '@drizztdourden08/tessera';
import { useRampBuilder } from '../behavior/useRampBuilder';
import { BUILDER_TEXT } from '../RampBuilderDialog.constants';
import type { BuilderDialogProps } from '../RampBuilderDialog.type';
import { BuilderControls } from './BuilderControls';
import { BuilderPreview } from './BuilderPreview';

const BuilderDialog = ({ request, live }: BuilderDialogProps) => {
  const state = useRampBuilder(request, live);
  const actions = (
    <>
      <Button variant="tertiary" onClick={state.cancel}>
        {BUILDER_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={!state.fits} onClick={state.apply}>
        {BUILDER_TEXT.apply}
      </Button>
    </>
  );
  return (
    <DialogShell open title={BUILDER_TEXT.title} onClose={state.cancel} actions={actions} className="ramp-builder">
      <Stack gap="md">
        <BuilderPreview state={state} />
        <BuilderControls state={state} />
        {state.failure !== null && <Callout tone="danger">{state.failure}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { BuilderDialog };
