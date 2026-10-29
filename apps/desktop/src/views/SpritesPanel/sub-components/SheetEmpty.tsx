/* @layer renderer-app @kind component */
import { Button, Center, EmptyState, Icon } from '@drizztdourden08/tessera';
import { newSheetTab } from '../../../sheet-manager/new-sheet-tab';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';

const createAndOpen = (): void => {
  void newSheetTab();
};

const SheetEmpty = () => (
  <Center direction="column" className="sprites-panel__empty">
    <EmptyState
      size="sm"
      icon={<Icon name="pixel-atlas" size={32} />}
      title={SHEET_TEXT.empty.noSheet}
      message={SHEET_TEXT.empty.noSheetBody}
      action={
        <Button size="xs" variant="primary" onClick={createAndOpen}>
          {MANAGER_TEXT.newSheet}
        </Button>
      }
    />
  </Center>
);

export { SheetEmpty };
