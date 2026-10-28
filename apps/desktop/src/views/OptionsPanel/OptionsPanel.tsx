/* @layer renderer-app @kind component */
import { ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { slotOfTool } from '../../editor/tool-catalogue/slot-of-tool';
import { optionsOf } from '../../editor/tool-options/options-of';
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';
import { useCatalogueSurface } from '../../hooks/useCatalogueSurface';
import { useToolStore } from '../../stores/useToolStore';
import { useOptionsVersion } from '../OptionControls';
import { OPTIONS_PANEL_TEXT } from './OptionsPanel.constants';
import { OptionSection } from './sub-components/OptionSection';
import { PanelFooter } from './sub-components/PanelFooter';
import { PanelNotes } from './sub-components/PanelNotes';
import { ToolHead } from './sub-components/ToolHead';
import './OptionsPanel.css';

const grouped = (specs: readonly OptionSpec[]): [string, OptionSpec[]][] => {
  const groups = new Map<string, OptionSpec[]>();
  for (const spec of specs) groups.set(spec.group, [...(groups.get(spec.group) ?? []), spec]);
  return [...groups];
};

const OptionsPanel = () => {
  const surface = useCatalogueSurface();
  const tool = useToolStore((state) => state.tool);
  useOptionsVersion();
  const slot = slotOfTool(surface, tool);
  if (surface === 'none' || !slot) {
    return (
      <Stack gap="xs" className="options-panel">
        <Text variant="title">{OPTIONS_PANEL_TEXT.none}</Text>
        <Text tone="muted">{OPTIONS_PANEL_TEXT.noneHint}</Text>
      </Stack>
    );
  }
  const editable = surface === 'sprite' || surface === 'tile';
  const tiers = optionsOf(surface, tool);
  const main = tiers.filter((spec) => spec.tier === 1);
  const more = tiers.filter((spec) => spec.tier === 2);
  return (
    <ScrollArea axis="y" scrollbar="slim" aria-label={OPTIONS_PANEL_TEXT.region}>
      <Stack gap="md" className="options-panel">
        <ToolHead slot={slot} editable={editable} />
        <PanelNotes sheet={surface === 'sheet'} empty={main.length === 0} />
        {grouped(main).map(([group, specs]) => (
          <OptionSection key={group} group={group} specs={specs} />
        ))}
        {more.length > 0 && <OptionSection group={OPTIONS_PANEL_TEXT.advanced} specs={more} />}
        {editable && <PanelFooter tool={tool} />}
      </Stack>
    </ScrollArea>
  );
};

export { OptionsPanel };
