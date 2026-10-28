/* @layer renderer-app @kind component */
import { Center, EmptyState, Icon, Stack } from '@drizztdourden08/tessera';
import { SHEET_TEXT } from '../../sheet-manager/sheet-text.constants';
import { useManagerModel } from './behavior/useManagerModel';
import { useSheetView } from './behavior/useSheetView';
import { ManagerDialogs } from './sub-components/ManagerDialogs';
import { SpriteBrowser } from './sub-components/SpriteBrowser';
import './SpritesPanel.css';

const SpritesPanel = () => {
  const model = useManagerModel();
  useSheetView(model?.sheet?.id ?? null);
  if (!model?.sheet) {
    return (
      <Center direction="column" className="sprites-panel__empty">
        <EmptyState size="sm" icon={<Icon name="pixel-atlas" size={32} />} title={SHEET_TEXT.empty.noSheet} message={SHEET_TEXT.empty.noSheetBody} />
      </Center>
    );
  }
  return (
    <Stack gap="xs" className="sprites-panel">
      <SpriteBrowser model={model} />
      <ManagerDialogs model={model} />
    </Stack>
  );
};

export { SpritesPanel };
