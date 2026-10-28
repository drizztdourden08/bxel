/* @layer renderer-app @kind component */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { Callout, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { presetFields } from '../../editor/presets/preset-fields';
import { slotsOf } from '../../editor/tool-catalogue/slots-of';
import { SLOT_GROUPS } from '../../editor/tool-catalogue/tool-catalogue.constants';
import { useSurface } from '../../hooks/useSurface';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useToolStore } from '../../stores/useToolStore';
import { useOptionsVersion } from '../OptionControls';
import { PresetList } from '../PresetList';
import { toolsPanelEntries } from './behavior/tools-panel-entries';
import { RecentStrip } from './sub-components/RecentStrip';
import { ToolGroup } from './sub-components/ToolGroup';
import { ToolPreferences } from './sub-components/ToolPreferences';
import { useToolKeys } from '../../hooks/useToolKeys';
import { TOOLS_PANEL_TEXT } from './ToolsPanel.constants';
import './ToolsPanel.css';

const ToolsPanel = () => {
  const surface = useSurface();
  const active = useToolStore((state) => state.tool);
  const shape = useToolStore((state) => state.shape);
  const variant = useSelectionStore((state) => state.variant);
  const keysOf = useToolKeys();
  useOptionsVersion();
  useContextMenu(TOOLS_PANEL_TEXT.zone, { entries: toolsPanelEntries, label: TOOLS_PANEL_TEXT.menuLabel });
  const slots = slotsOf(surface);
  const presets = surface !== 'none' && surface !== 'map' && presetFields(active).length > 0;
  return (
    <ScrollArea axis="y" scrollbar="slim" aria-label={TOOLS_PANEL_TEXT.region}>
      <Stack gap="md" className="tools-panel">
        {surface === 'none' && <Callout tone="info">{TOOLS_PANEL_TEXT.inactive}</Callout>}
        <RecentStrip />
        {SLOT_GROUPS.map((group) => {
          const own = slots.filter((slot) => slot.group === group.id);
          return own.length === 0 ? null : (
            <ToolGroup key={group.id} group={group} slots={own} surface={surface} active={active} choice={{ shape, variant }} keysOf={keysOf} />
          );
        })}
        {presets && (
          <Stack gap="xs">
            <Text variant="overline" tone="muted" className="tools-panel__heading">
              {TOOLS_PANEL_TEXT.presets}
            </Text>
            <PresetList tool={active} />
          </Stack>
        )}
        <ToolPreferences />
      </Stack>
    </ScrollArea>
  );
};

export { ToolsPanel };
