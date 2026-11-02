/* @layer renderer-app @kind hook */
import type { PaletteSection } from '@drizztdourden08/tessera';
import { allPresets } from '../../../editor/presets/all-presets';
import { presetsOfTool } from '../../../editor/presets/presets-of-tool';
import { quickSections } from '../../../editor/quick-palette/quick-sections';
import { useCatalogueSurface } from '../../../hooks/useCatalogueSurface';
import { useToolKeys } from '../../../hooks/useToolKeys';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';

const useQuickSections = (): PaletteSection[] => {
  const surface = useCatalogueSurface();
  const keysOf = useToolKeys();
  const tool = useToolStore((state) => state.tool);
  const kind = useToolStore((state) => state.activeSurface);
  const recent = useToolStore((state) => state.recentMembers[kind]);
  const user = useToolPresetStore((state) => state.user);
  useToolPrefsStore((state) => state.layouts);
  return quickSections({ surface, recent, presets: presetsOfTool(allPresets(user), tool), keysOf });
};

export { useQuickSections };
