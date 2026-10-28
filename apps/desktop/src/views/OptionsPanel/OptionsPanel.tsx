/* @layer renderer-app @kind component */
import { Button, Callout, Icon, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { presetFields } from '../../editor/presets/preset-fields';
import { slotOfTool } from '../../editor/tool-catalogue/slot-of-tool';
import { optionsOf } from '../../editor/tool-options/options-of';
import { resetAllTools } from '../../editor/tool-options/reset-all-tools';
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';
import { useSurface } from '../../hooks/useSurface';
import { useToolStore } from '../../stores/useToolStore';
import { useOptionsVersion } from '../OptionControls';
import { PresetList } from '../PresetList';
import { OPTIONS_PANEL_TEXT } from './OptionsPanel.constants';
import { OptionSection } from './sub-components/OptionSection';
import { ToolHead } from './sub-components/ToolHead';
import './OptionsPanel.css';

const grouped = (specs: readonly OptionSpec[]): [string, OptionSpec[]][] => {
  const groups = new Map<string, OptionSpec[]>();
  for (const spec of specs) groups.set(spec.group, [...(groups.get(spec.group) ?? []), spec]);
  return [...groups];
};

const OptionsPanel = () => {
  const surface = useSurface();
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
  const sheet = surface === 'sheet';
  const tiers = optionsOf(surface, tool);
  const main = tiers.filter((spec) => spec.tier === 1);
  const more = tiers.filter((spec) => spec.tier === 2);
  return (
    <ScrollArea axis="y" scrollbar="slim" aria-label={OPTIONS_PANEL_TEXT.region}>
      <Stack gap="md" className="options-panel">
        <ToolHead slot={slot} editable={editable} />
        {sheet && <Callout tone="info">{OPTIONS_PANEL_TEXT.sheet}</Callout>}
        {!sheet && main.length === 0 && <Text tone="muted">{OPTIONS_PANEL_TEXT.noOptions}</Text>}
        {grouped(main).map(([group, specs]) => (
          <OptionSection key={group} group={group} specs={specs} />
        ))}
        {more.length > 0 && <OptionSection group={OPTIONS_PANEL_TEXT.advanced} specs={more} />}
        {editable && presetFields(tool).length > 0 && (
          <Stack gap="xs">
            <Text variant="overline" tone="muted" className="options-panel__heading">
              {OPTIONS_PANEL_TEXT.presets}
            </Text>
            <PresetList tool={tool} />
          </Stack>
        )}
        {editable && (
          <Button size="sm" variant="tertiary" icon={<Icon name="rotate-ccw" />} onClick={resetAllTools}>
            {OPTIONS_PANEL_TEXT.resetAll}
          </Button>
        )}
      </Stack>
    </ScrollArea>
  );
};

export { OptionsPanel };
