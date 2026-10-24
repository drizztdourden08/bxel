/* @layer renderer-app @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../stores/useManagerStore';
import { useManagerModel } from './behavior/useManagerModel';
import { AtlasView } from './sub-components/AtlasView';
import { ManagerDialogs } from './sub-components/ManagerDialogs';
import { ManagerHeader } from './sub-components/ManagerHeader';
import { SpriteBrowser } from './sub-components/SpriteBrowser';
import './SpritesPanel.css';

const SpritesPanel = () => {
  const model = useManagerModel();
  const tab = useManagerStore((state) => state.tab);
  if (!model) return <EmptyState message={MANAGER_TEXT.empty} />;
  return (
    <Stack gap="sm">
      <ManagerHeader model={model} />
      {tab === 'atlas' ? <AtlasView model={model} /> : <SpriteBrowser model={model} />}
      <ManagerDialogs model={model} />
    </Stack>
  );
};

export { SpritesPanel };
