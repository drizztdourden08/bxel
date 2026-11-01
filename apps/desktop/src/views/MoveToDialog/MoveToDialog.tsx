/* @layer renderer-app @kind component */
import { Button, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { moveEntries } from '../../file-ops/move-entries';
import { useMoveToStore } from '../../stores/useMoveToStore';
import { MOVE_TO_TEXT } from './MoveToDialog.constants';

const MoveToDialog = () => {
  const request = useMoveToStore((state) => state.request);
  const hide = useMoveToStore((state) => state.hide);
  if (request === null) return null;
  const choose = (folder: string) => () => {
    hide();
    void moveEntries(request.paths, folder);
  };
  const actions = (
    <Button variant="tertiary" onClick={hide}>
      {MOVE_TO_TEXT.cancel}
    </Button>
  );
  return (
    <DialogShell open title={MOVE_TO_TEXT.title} onClose={hide} actions={actions}>
      <Stack gap="sm">
        <Text>{request.targets.length === 0 ? MOVE_TO_TEXT.empty : MOVE_TO_TEXT.message(request.paths.length)}</Text>
        {request.targets.map((target) => (
          <Button key={target.path} variant="secondary" icon="folder" onClick={choose(target.path)}>
            {target.label}
          </Button>
        ))}
      </Stack>
    </DialogShell>
  );
};

export { MoveToDialog };
