/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, SegmentedControl, Stack, Text, Textarea } from '@drizztdourden08/tessera';
import { IMPORT_MODE_OPTIONS, IMPORT_TEXT } from '../../../palette-import/palette-import.constants';
import { opaqueSlots } from '../../../palette-limit/opaque-slots';
import { usePaletteImport } from '../behavior/usePaletteImport';
import type { ImportDialogProps } from '../PaletteImportDialog.type';
import { ImportSummary } from './ImportSummary';

const ImportDialog = ({ request, target }: ImportDialogProps) => {
  const state = usePaletteImport(request, target);
  const { plan, error, failure, mode, text, cancel, apply } = state;
  const { bank } = target;
  const free = state.mode === 'append' ? Math.max(0, bank.cap - bank.slots.length) : opaqueSlots(bank.cap, bank.transparent);
  const empty = !plan || plan.steps.length === 0;
  const actions = (
    <>
      <Button variant="tertiary" onClick={cancel}>
        {IMPORT_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={empty || error !== null} onClick={apply}>
        {plan?.apply ?? IMPORT_TEXT.title}
      </Button>
    </>
  );
  return (
    <DialogShell open title={IMPORT_TEXT.title} onClose={cancel} actions={actions} className="palette-import">
      <Stack gap="md">
        <Button variant="secondary" onClick={state.chooseFile}>
          {IMPORT_TEXT.file}
        </Button>
        <Textarea aria-label={IMPORT_TEXT.paste} placeholder={IMPORT_TEXT.pastePlaceholder} rows={3} value={text} onChange={(event) => state.setText(event.target.value)} />
        <SegmentedControl size="sm" aria-label={IMPORT_TEXT.modes} value={mode} options={IMPORT_MODE_OPTIONS} onChange={state.setMode} />
        <Text variant="caption" tone="muted">
          {IMPORT_TEXT.modeNote[mode]}
        </Text>
        <ImportSummary state={state} free={free} />
        {error !== null && <Callout tone="warning">{error}</Callout>}
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { ImportDialog };
