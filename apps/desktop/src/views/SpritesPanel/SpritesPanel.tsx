/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { useManagerModel } from './behavior/useManagerModel';
import { useSheetTitle } from './behavior/useSheetTitle';
import { useSheetView } from './behavior/useSheetView';
import { ManagerDialogs } from './sub-components/ManagerDialogs';
import { SheetEmpty } from './sub-components/SheetEmpty';
import { SpriteBrowser } from './sub-components/SpriteBrowser';
import './SpritesPanel.css';

const SpritesPanel = () => {
  const model = useManagerModel();
  useSheetView(model?.sheet?.id ?? null);
  useSheetTitle(model?.sheet?.name ?? null, (model?.facts.length ?? 0) + (model?.animationFacts.length ?? 0));
  if (!model?.sheet) return <SheetEmpty />;
  return (
    <Stack gap="xs" className="sprites-panel">
      <SpriteBrowser model={model} />
      <ManagerDialogs model={model} />
    </Stack>
  );
};

export { SpritesPanel };
