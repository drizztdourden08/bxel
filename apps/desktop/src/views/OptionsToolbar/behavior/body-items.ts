/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { optionsOf } from '../../../editor/tool-options/options-of';
import type { ToolId } from '../../../editor/tool.type';
import type { KeysOf } from '../../../hooks/use-keys-of.type';
import { TOOL_HINTS } from '../OptionsToolbar.constants';
import { noteItem } from './note-item';
import { optionItems } from './option-items';

const bodyItems = (surface: Surface, tool: ToolId, slot: ToolSlot, keysOf: KeysOf): ToolbarItem[] => {
  const specs = optionsOf(surface, tool).filter((spec) => spec.tier === 1);
  if (specs.length > 0) return optionItems(specs, keysOf);
  return [noteItem('tool-hint', TOOL_HINTS[tool] ?? slot.members[0]?.description ?? '')];
};

export { bodyItems };
