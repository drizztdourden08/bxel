/* @layer renderer-app @kind component */
import { Button, DialogShell, Flex, Text } from '@drizztdourden08/tessera';
import { pasteCropped } from '../../editor/selection/paste-cropped';
import { pasteExpanded } from '../../editor/selection/paste-expanded';
import { pasteNewSprite } from '../../editor/selection/paste-new-sprite';
import { usePasteChoiceStore } from '../../stores/usePasteChoiceStore';
import { PASTE_CHOICE_TEXT } from './PasteChoiceDialog.constants';

const PasteChoiceDialog = () => {
  const open = usePasteChoiceStore((state) => state.open);
  const hide = usePasteChoiceStore((state) => state.hide);
  if (!open) return null;
  const choose = (run: () => boolean) => () => {
    hide();
    run();
  };
  const actions = (
    <Flex gap="sm" wrap>
      <Button variant="tertiary" onClick={hide}>{PASTE_CHOICE_TEXT.cancel}</Button>
      <Button variant="secondary" onClick={choose(pasteNewSprite)}>{PASTE_CHOICE_TEXT.sprite}</Button>
      <Button variant="secondary" onClick={choose(pasteExpanded)}>{PASTE_CHOICE_TEXT.expand}</Button>
      <Button variant="primary" onClick={choose(pasteCropped)}>{PASTE_CHOICE_TEXT.crop}</Button>
    </Flex>
  );
  return (
    <DialogShell open title={PASTE_CHOICE_TEXT.title} onClose={hide} actions={actions}>
      <Text>{PASTE_CHOICE_TEXT.message}</Text>
    </DialogShell>
  );
};

export { PasteChoiceDialog };
