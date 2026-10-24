/* @layer renderer-app @kind component */
import { Button, Field, Flex, Select, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { presetGroups } from '../../../export/preset-groups';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { PresetBarProps } from '../ExportDialog.type';

const PresetBar = ({ presets, naming, onApply, onSave, onDone }: PresetBarProps) => {
  const [name, setName] = useState('');
  const save = (): void => {
    onSave(name);
    setName('');
    onDone();
  };
  return (
    <Flex gap="md" wrap align="end">
      {presets.length > 0 && (
        <Field label={EXPORT_DIALOG_TEXT.preset}>
          <Select
            size="sm"
            aria-label={EXPORT_DIALOG_TEXT.preset}
            placeholder={EXPORT_DIALOG_TEXT.presetNone}
            groups={presetGroups(presets)}
            onChange={onApply}
          />
        </Field>
      )}
      {naming && (
        <Field label={EXPORT_DIALOG_TEXT.presetName}>
          <Flex gap="sm">
            <TextInput
              size="sm"
              value={name}
              aria-label={EXPORT_DIALOG_TEXT.presetName}
              onChange={(event) => setName(event.target.value)}
              onEnter={save}
            />
            <Button size="sm" variant="secondary" disabled={name.trim() === ''} onClick={save}>
              {EXPORT_DIALOG_TEXT.saveNamed}
            </Button>
          </Flex>
        </Field>
      )}
    </Flex>
  );
};

export { PresetBar };
