/* @layer renderer-app @kind hook */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { slotOfTool } from '../../../editor/tool-catalogue/slot-of-tool';
import { optionsOf } from '../../../editor/tool-options/options-of';
import { surfaceOfContext } from '../../../editor/tool-catalogue/surface-of-context';
import { useKeysOf } from '../../../hooks/useKeysOf';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { useTileUses } from '../../../hooks/useTileUses';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useProjectStore } from '../../../stores/useProjectStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';
import { evaluate } from '../../../ui-context/evaluate';
import { useBxelContext } from '../../../ui-context/useBxelContext';
import { useOptionsVersion } from '../../OptionControls';
import { OPTIONS_TEXT, TOOL_HINTS } from '../OptionsToolbar.constants';
import { chipItem } from './chip-item';
import { moreItem } from './more-item';
import { scopeChips } from './scope-chips';
import { useChipMenuStore } from '../../../stores/useChipMenuStore';
import { symmetryItem } from './symmetry-item';
import { optionItems } from './option-items';

const noteItem = (id: string, caption: string): ToolbarItem => ({
  kind: 'button',
  id,
  label: caption,
  description: OPTIONS_TEXT.noOptions,
  icon: 'info',
  caption,
  disabled: true,
  onSelect: () => undefined,
});

const useOptionsItems = (): ToolbarItem[] => {
  const context = useBxelContext((current) => current);
  const surface = surfaceOfContext(context);
  const tool = useToolStore((state) => state.tool);
  useSelectionStore((state) => state.variant);
  useToolPresetStore((state) => state.user);
  useProjectStore((state) => state.project?.manifest.toolPresets);
  useOptionsVersion();
  useToolPrefsStore((state) => state.optionTiers);
  useWidgetLayoutStore((state) => state.layout);
  const everyTool = useChipMenuStore((state) => state.everyTool);
  const broadcast = useSpriteStore((state) => state.broadcast);
  const selected = useSpriteScene()?.scene.selected.length ?? 0;
  const tileUses = useTileUses();
  const keysOf = useKeysOf();
  if (surface === 'none' || evaluate('toolbar.options', context).state === 'hidden') return [];
  if (surface === 'sheet') return [noteItem('sheet-note', `${OPTIONS_TEXT.sheetName}: ${OPTIONS_TEXT.sheetHint}`)];
  const slot = slotOfTool(surface, tool);
  if (!slot) return [];
  const specs = optionsOf(surface, tool).filter((spec) => spec.tier === 1);
  const more = optionsOf(surface, tool).filter((spec) => spec.tier === 2);
  const body = specs.length > 0 ? optionItems(specs, keysOf) : [noteItem('tool-hint', TOOL_HINTS[tool] ?? slot.members[0]?.description ?? '')];
  const chips = scopeChips({ surface, tileUses, broadcast, selected });
  return [chipItem(slot, surface, { everyTool }), ...chips, { kind: 'separator', id: 'after-chip' }, ...body, ...symmetryItem(surface), { kind: 'separator', id: 'before-more' }, moreItem(more)];
};

export { useOptionsItems };
