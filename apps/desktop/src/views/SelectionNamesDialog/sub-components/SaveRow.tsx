/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Button, Field, Flex, Text, TextInput } from '@drizztdourden08/tessera';
import { saveSelection } from '../../../editor/selection/save-selection';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { SELECTION_NAMES_TEXT } from '../SelectionNamesDialog.constants';

const SaveRow = () => {
  const [name, setName] = useState('');
  const hasMask = useSelectionStore((state) => state.mask !== null);
  const ready = hasMask && name.trim().length > 0;
  const save = (): void => {
    if (ready && saveSelection(name)) setName('');
  };
  return (
    <Flex gap="sm" align="end" wrap>
      <Field label={SELECTION_NAMES_TEXT.nameLabel} inline size="sm">
        <TextInput size="sm" value={name} placeholder={SELECTION_NAMES_TEXT.namePlaceholder} aria-label={SELECTION_NAMES_TEXT.nameLabel} onChange={(event) => setName(event.target.value)} onEnter={save} />
      </Field>
      <Button variant="primary" disabled={!ready} onClick={save}>{SELECTION_NAMES_TEXT.save}</Button>
      {!hasMask && <Text as="span" variant="caption">{SELECTION_NAMES_TEXT.needsSelection}</Text>}
    </Flex>
  );
};

export { SaveRow };
