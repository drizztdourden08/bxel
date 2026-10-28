/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { surfaceOfContext } from '../../../editor/tool-catalogue/surface-of-context';
import { shownMember } from '../../../editor/tool-catalogue/shown-member';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useOptionsVersion } from '../../OptionControls';
import { flyoutGroups } from '../../../tool-menu/flyout-groups';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { flyoutSections } from '../../../tool-menu/flyout-sections';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { ruledItems } from '../../../toolbar-items/ruled-items';
import { tidyItems } from '../../../toolbar-items/tidy-items';
import { evaluate } from '../../../ui-context/evaluate';
import { useBxelContext } from '../../../ui-context/useBxelContext';
import { railItems } from './rail-items';
import { slotBadge } from './slot-badge';
import { useTileModeItem } from './useTileModeItem';
import { useToolKeys } from '../../../hooks/useToolKeys';

const useRailItems = (): ToolbarItem[] => {
  const context = useBxelContext((current) => current);
  const surface = surfaceOfContext(context);
  const active = useToolStore((state) => state.tool);
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const fillMode = useToolStore((state) => state.fillMode);
  const mode = useSelectionStore((state) => state.mode);
  const variant = useSelectionStore((state) => state.variant);
  const hidden = useToolPrefsStore((state) => state.hiddenMembers);
  const hover = useToolPrefsStore((state) => state.openOnHover);
  useToolPresetStore((state) => state.user);
  useOptionsVersion();
  const keysOf = useToolKeys();
  const tileMode = useTileModeItem();
  const slots = slotsOf(surface).filter((slot) => !slot.members.every((member) => hidden.includes(member.id)));
  const contextOf = (slot: ToolSlot) => {
    const model = flyoutModel(slot, surface);
    return {
      surface,
      active,
      shown: shownMember(slot, { shape, variant }),
      filled: slot.tool === 'shape' && filled,
      badge: slotBadge(slot, { fillMode, filled, shape, mode }),
      keys: keysOf(slot.tool),
      ui: evaluate(COMMAND_ID.tool(slot.tool), context),
      groups: hover && model.hasContent ? flyoutGroups(flyoutSections(model, true)) : undefined,
      hasFlyout: model.hasContent,
      pick: (picked: ToolSlot) => useToolStore.getState().setTool(picked.tool),
    };
  };
  return tidyItems([...ruledItems(tileMode, context), ...railItems(slots, contextOf)]);
};

export { useRailItems };
