/* @layer renderer-app @kind component */
import { Flex, Stack, Tabs, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { MANAGER_TABS } from '../SpritesPanel.constants';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { SheetPicker } from './SheetPicker';

const ManagerHeader = ({ model }: ManagerModelProps) => {
  const tab = useManagerStore((state) => state.tab);
  const patch = useManagerStore((state) => state.patch);
  return (
    <Stack gap="xs">
      <Flex justify="between" align="center" gap="sm">
        <Text variant="label">{MANAGER_TEXT.title(model.facts.length, model.scene.selected.length)}</Text>
        <SheetPicker model={model} />
      </Flex>
      <Tabs tabs={MANAGER_TABS} activeTab={tab} onTabChange={(id) => patch({ tab: id === 'atlas' ? 'atlas' : 'sprites' })} />
    </Stack>
  );
};

export { ManagerHeader };
