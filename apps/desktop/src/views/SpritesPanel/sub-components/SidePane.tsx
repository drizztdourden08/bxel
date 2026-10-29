/* @layer renderer-app @kind component */
import { ScrollArea, Stack, Tabs } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { LayoutBody } from './LayoutSection/sub-components/LayoutBody';
import { LibraryDrawer } from './LibraryDrawer';
import { SIDE_TABS } from './SidePane.constants';

const SidePane = ({ model }: ManagerModelProps) => {
  const layoutOpen = useManagerStore((state) => state.layoutOpen);
  const [tab, setTab] = useState(layoutOpen ? 'layout' : 'library');
  return (
    <Stack gap="xs" className="sprites-panel__side">
      <Tabs tabs={SIDE_TABS} activeTab={tab} onTabChange={setTab} />
      {tab === 'library' ? (
        <LibraryDrawer model={model} />
      ) : (
        <ScrollArea axis="y" scrollbar="slim" fade={false} className="sprites-panel__side-scroll">
          <LayoutBody model={model} />
        </ScrollArea>
      )}
    </Stack>
  );
};

export { SidePane };
