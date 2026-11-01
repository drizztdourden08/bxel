/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { noteToolPick } from '../../../editor/tool-pick/note-tool-pick';
import { surfaceOfContext } from '../../../editor/tool-catalogue/surface-of-context';
import { shownMember } from '../../../editor/tool-catalogue/shown-member';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { useAssistantMarkStore } from '../../../stores/useAssistantMarkStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useSpringStore } from '../../../editor/tool-pick/behavior/useSpringStore';
import { useToolPrefsStore } from '../../../stores/useToolPrefsStore';
import { useToolPresetStore } from '../../../stores/useToolPresetStore';
import { drawingVersion } from '../../../stores/drawing-version';
import { useDrawingStore } from '../../../stores/useDrawingStore';
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
  const marked = useAssistantMarkStore((state) => state.tool);
  const borrowed = useSpringStore((state) => state.borrowed);
  const filledTools = useDrawingStore((state) => state.filled);
  useDrawingStore(drawingVersion);
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
      borrowed,
      shown: shownMember(slot, { variant }),
      filled: slot.tool === 'rect' || slot.tool === 'ellipse' ? filledTools[slot.tool] : false,
      badge: slotBadge(slot, { fillMode, filled: slot.tool === 'rect' || slot.tool === 'ellipse' ? filledTools[slot.tool] : false, mode }),
      keys: keysOf(slot.tool),
      ui: evaluate(COMMAND_ID.tool(slot.tool), context),
      groups: hover && model.hasContent ? flyoutGroups(flyoutSections(model, true)) : undefined,
      hasFlyout: model.hasContent,
      assistant: slot.members.some((member) => member.tool === marked),
      pick: (picked: ToolSlot) => {
        useToolStore.getState().setTool(picked.tool);
        noteToolPick(picked.tool);
      },
    };
  };
  return tidyItems([...ruledItems(tileMode, context), ...railItems(slots, contextOf)]);
};

export { useRailItems };
