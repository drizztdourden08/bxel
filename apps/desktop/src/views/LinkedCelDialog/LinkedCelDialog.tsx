/* @layer renderer-app @kind component */
import { Button, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../stores/useDrawingStore';
import { useLinkedPromptStore } from '../../stores/useLinkedPromptStore';
import { LINKED_TEXT } from './LinkedCelDialog.constants';

const LinkedCelDialog = () => {
  const open = useLinkedPromptStore((state) => state.open);
  const hide = useLinkedPromptStore((state) => state.hide);
  const patch = useDrawingStore((state) => state.patch);
  if (!open) return null;
  const choose = (linkedChoice: 'unlink' | 'all') => (): void => {
    patch({ linkedChoice });
    hide();
  };
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {LINKED_TEXT.cancel}
      </Button>
      <Button variant="secondary" onClick={choose('all')}>
        {LINKED_TEXT.all}
      </Button>
      <Button variant="primary" onClick={choose('unlink')}>
        {LINKED_TEXT.unlink}
      </Button>
    </>
  );
  return (
    <DialogShell open title={LINKED_TEXT.title} onClose={hide} actions={actions}>
      <Stack gap="md">
        <Text>{LINKED_TEXT.body}</Text>
        <Text tone="muted">{`${LINKED_TEXT.unlink}: ${LINKED_TEXT.unlinkDescription}`}</Text>
        <Text tone="muted">{`${LINKED_TEXT.all}: ${LINKED_TEXT.allDescription}`}</Text>
      </Stack>
    </DialogShell>
  );
};

export { LinkedCelDialog };
