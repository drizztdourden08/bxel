/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { SHEET_TEXT } from '../../../palette-panel/palette-panel.constants';
import { usePaletteSheet } from '../behavior/usePaletteSheet';
import type { SheetDialogProps } from '../PaletteSheetDialog.type';
import { StripRow } from './StripRow';

const SheetDialog = ({ request, target }: SheetDialogProps) => {
  const { plan, error, failure, apply, cancel } = usePaletteSheet(request, target);
  if (!plan) return null;
  const empty = plan.steps.length === 0;
  const actions = (
    <>
      <Button variant="tertiary" onClick={cancel}>
        {SHEET_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={empty || error !== null} onClick={apply}>
        {plan.apply}
      </Button>
    </>
  );
  return (
    <DialogShell open title={plan.title} onClose={cancel} actions={actions} className="palette-sheet">
      <Stack gap="md">
        <Text variant="body">{plan.note}</Text>
        {plan.gone.length > 0 && <StripRow label={SHEET_TEXT.gone} colours={plan.gone} />}
        {!empty && <StripRow label={SHEET_TEXT.before} colours={plan.before} />}
        {!empty && <StripRow label={SHEET_TEXT.after} colours={plan.after} />}
        {error !== null && <Callout tone="warning">{error}</Callout>}
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { SheetDialog };
