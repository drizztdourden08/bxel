/* @layer renderer-app @kind component */
import { Button, DialogShell, Stack } from '@drizztdourden08/tessera';
import { useSelectionNamesStore } from '../../stores/useSelectionNamesStore';
import { SELECTION_NAMES_TEXT } from './SelectionNamesDialog.constants';
import { SaveRow } from './sub-components/SaveRow';
import { SavedList } from './sub-components/SavedList';

const SelectionNamesDialog = () => {
  const open = useSelectionNamesStore((state) => state.open);
  const hide = useSelectionNamesStore((state) => state.hide);
  if (!open) return null;
  return (
    <DialogShell open title={SELECTION_NAMES_TEXT.title} onClose={hide} actions={<Button variant="primary" onClick={hide}>{SELECTION_NAMES_TEXT.close}</Button>}>
      <Stack gap="md">
        <SaveRow />
        <SavedList />
      </Stack>
    </DialogShell>
  );
};

export { SelectionNamesDialog };
