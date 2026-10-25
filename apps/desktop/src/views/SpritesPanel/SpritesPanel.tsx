/* @layer renderer-app @kind component */
import { Center, EmptyState, ScrollArea, Stack } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../stores/useManagerStore';
import { useManagerModel } from './behavior/useManagerModel';
import { useSheetView } from './behavior/useSheetView';
import { AtlasView } from './sub-components/AtlasView';
import { ManagerDialogs } from './sub-components/ManagerDialogs';
import { ManagerHeader } from './sub-components/ManagerHeader';
import { SpriteBrowser } from './sub-components/SpriteBrowser';
import './SpritesPanel.css';

const SpritesPanel = () => {
  const model = useManagerModel();
  const tab = useManagerStore((state) => state.tab);
  useSheetView(model?.sheet?.id ?? null);
  if (!model) {
    return (
      <Center direction="column">
        <EmptyState size="sm" message={MANAGER_TEXT.empty} />
      </Center>
    );
  }
  return (
    <Stack gap="xs">
      <ManagerHeader model={model} />
      {tab === 'atlas' ? (
        <ScrollArea axis="y" scrollbar="slim" fade={false} className="sprites-panel__scroll">
          <AtlasView model={model} />
        </ScrollArea>
      ) : (
        <SpriteBrowser model={model} />
      )}
      <ManagerDialogs model={model} />
    </Stack>
  );
};

export { SpritesPanel };
