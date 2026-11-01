/* @layer renderer-app @kind logic */
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';
import type { Surface } from '../tool-catalogue/surface.type';
import type { ToolId } from '../tool.type';
import { optionSurface } from './option-surface';
import { OPTION_SPECS } from './option-specs.constants';
import type { OptionSpec } from './tool-options.type';

const optionsOf = (surface: Surface, tool: ToolId): OptionSpec[] => {
  const own = optionSurface(surface);
  if (own === null) return [];
  const tiers = useToolPrefsStore.getState().optionTiers;
  return OPTION_SPECS.filter((spec) => spec.surface === own && spec.tool === tool && spec.appliesWhen?.() !== false)
    .sort((a, b) => a.priority - b.priority)
    .map((spec) => (tiers[spec.id] === undefined || tiers[spec.id] === spec.tier ? spec : { ...spec, tier: tiers[spec.id] ?? spec.tier }));
};

export { optionsOf };
