/* @layer renderer-app @kind hook */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { slotOfTool } from '../../../editor/tool-catalogue/slot-of-tool';
import { optionsOf } from '../../../editor/tool-options/options-of';
import { useKeysOf } from '../../../hooks/useKeysOf';
import { useSurface } from '../../../hooks/useSurface';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';
import { OPTIONS_WIDGET_ID } from '../../../tool-menu/tool-menu.constants';
import { useOptionsVersion } from '../../OptionControls';
import { OPTIONS_TEXT, TOOL_HINTS } from '../OptionsToolbar.constants';
import { chipItem } from './chip-item';
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

const moreItem = (): ToolbarItem => ({
  kind: 'button',
  id: 'options-more',
  label: OPTIONS_TEXT.more,
  description: OPTIONS_TEXT.moreDescription,
  icon: 'sliders-horizontal',
  onSelect: () => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID),
});

const useOptionsItems = (): ToolbarItem[] => {
  const surface = useSurface();
  const tool = useToolStore((state) => state.tool);
  useSelectionStore((state) => state.variant);
  useToolPresetStore((state) => state.user);
  useOptionsVersion();
  const keysOf = useKeysOf();
  if (surface === 'none') return [];
  if (surface === 'sheet') return [noteItem('sheet-note', `${OPTIONS_TEXT.sheetName}: ${OPTIONS_TEXT.sheetHint}`)];
  const slot = slotOfTool(surface, tool);
  if (!slot) return [];
  const specs = optionsOf(surface, tool).filter((spec) => spec.tier === 1);
  const body = specs.length > 0 ? optionItems(specs, keysOf) : [noteItem('tool-hint', TOOL_HINTS[tool] ?? slot.members[0]?.description ?? '')];
  return [chipItem(slot, surface), { kind: 'separator', id: 'after-chip' }, ...body, { kind: 'separator', id: 'before-more' }, moreItem()];
};

export { useOptionsItems };
