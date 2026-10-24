/* @layer renderer-app @kind component */
import { Field, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { SELECTION_TEXT } from '../../../../../sheet-manager/selection-text.constants';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { DialogFrame } from './DialogFrame';

const SelectionDialog = ({ model }: ManagerModelProps) => {
  const [name, setName] = useState('');
  const save = useManagerStore((state) => state.saveSelection);
  const wanted = name.trim();
  return (
    <DialogFrame title={SELECTION_TEXT.title} canApply={wanted !== '' && model.ids.length > 0} onApply={() => save({ name: wanted, ids: model.ids })}>
      <Stack gap="md">
        <Field label={SELECTION_TEXT.field} hint={SELECTION_TEXT.hint}>
          <TextInput autoFocus value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Text tone="dim">{SELECTION_TEXT.count(model.ids.length)}</Text>
      </Stack>
    </DialogFrame>
  );
};

export { SelectionDialog };
