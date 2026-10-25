/* @layer renderer-app @kind component */
import { Box, Flex, Tabs } from '@drizztdourden08/tessera';
import { useManagerStore } from '../../../stores/useManagerStore';
import { MANAGER_TABS } from '../SpritesPanel.constants';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { SheetPicker } from './SheetPicker';

const ManagerHeader = ({ model }: ManagerModelProps) => {
  const tab = useManagerStore((state) => state.tab);
  const patch = useManagerStore((state) => state.patch);
  return (
    <Flex align="center" gap="sm">
      <Tabs tabs={MANAGER_TABS} activeTab={tab} onTabChange={(id) => patch({ tab: id === 'atlas' ? 'atlas' : 'sprites' })} />
      <Box className="sprites-panel__picker">
        <SheetPicker model={model} />
      </Box>
    </Flex>
  );
};

export { ManagerHeader };
