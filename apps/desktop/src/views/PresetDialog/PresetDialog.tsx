/* @layer renderer-app @kind component */
import { Button, DialogShell, Stack, TextInput } from '@drizztdourden08/tessera';
import { saveDraft } from '../../editor/presets/save-draft';
import { useToolPresetStore } from '../../stores/useToolPresetStore';
import { usePresetForm } from './behavior/usePresetForm';
import { PRESET_DIALOG_TEXT } from './PresetDialog.constants';
import { PresetFields } from './sub-components/PresetFields';

const PresetDialogContent = () => {
  const draft = useToolPresetStore((state) => state.draft);
  const close = useToolPresetStore((state) => state.openDraft);
  const form = usePresetForm(draft ?? { member: '', name: '', ticked: [] });
  if (draft === null) return null;
  const hide = (): void => close(null);
  const save = (): void => {
    if (form.valid && saveDraft({ ...draft, name: form.name, ticked: form.ticked }) !== null) hide();
  };
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {PRESET_DIALOG_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={!form.valid} onClick={save}>
        {PRESET_DIALOG_TEXT.save}
      </Button>
    </>
  );
  return (
    <DialogShell open title={draft.replaces === undefined ? PRESET_DIALOG_TEXT.titleNew : PRESET_DIALOG_TEXT.titleEdit} onClose={hide} actions={actions}>
      <Stack gap="md">
        <TextInput
          size="sm"
          value={form.name}
          placeholder={PRESET_DIALOG_TEXT.namePlaceholder}
          aria-label={PRESET_DIALOG_TEXT.name}
          autoFocus
          onChange={(event) => form.setName(event.target.value)}
          onEnter={save}
        />
        <PresetFields member={draft.member} form={form} />
      </Stack>
    </DialogShell>
  );
};

const PresetDialog = () => {
  const open = useToolPresetStore((state) => state.draft !== null);
  return open ? <PresetDialogContent /> : null;
};

export { PresetDialog };
