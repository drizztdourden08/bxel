/* @layer renderer-app @kind logic */
import type { ToolbarItem, ToolbarToggle } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { CATALOGUE_TEXT, SLOT_GROUPS } from '../../../editor/tool-catalogue/tool-catalogue.constants';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { SlotIcon } from '../../SlotIcon';
import type { SlotIconProps } from '../../SlotIcon/SlotIcon.type';
import { RAIL_PRIORITY } from '../ToolRail.constants';
import type { SlotItemContext } from '../ToolRail.type';

const slotLabel = (slot: ToolSlot, context: SlotItemContext): string =>
  slot.members.length > 1 ? `${slot.label}, ${context.shown.label}` : slot.label;

const slotMark = (slot: ToolSlot, context: SlotItemContext): SlotIconProps['mark'] => {
  if (slot.members.length > 1) return 'corner';
  return context.hasFlyout ? 'dot' : null;
};

const slotDescription = (context: SlotItemContext): string => {
  if (context.ui.state === 'disabled' && context.ui.reason !== null) return context.ui.reason;
  return [context.shown.description, context.badge?.text].filter(Boolean).join(' ');
};

const slotItem = (slot: ToolSlot, context: SlotItemContext): ToolbarToggle => {
  const off = context.ui.state === 'disabled';
  return {
    kind: 'toggle',
    id: slot.id,
    priority: RAIL_PRIORITY[slot.id] ?? 0,
    label: slotLabel(slot, context),
    description: slotDescription(context),
    shortcut: context.keys,
    icon: createElement(SlotIcon, { member: context.shown, filled: context.filled, mark: slotMark(slot, context), badge: context.badge, assistant: context.assistant }),
    options: off ? undefined : context.groups,
    openOn: context.hover ? 'hover' : 'hold',
    holdDelay: context.holdMs,
    pressed: context.active === slot.tool && !off,
    borrowed: context.borrowed === slot.tool,
    disabled: off,
    onChange: () => context.pick(slot),
  };
};

const groupName = (slot: ToolSlot): string | undefined => {
  const group = SLOT_GROUPS.find((entry) => entry.id === slot.group);
  return group ? CATALOGUE_TEXT.group(group.label) : undefined;
};

const railItems = (slots: readonly ToolSlot[], contextOf: (slot: ToolSlot) => SlotItemContext): ToolbarItem[] => {
  const shown = slots.flatMap((slot) => {
    const context = contextOf(slot);
    return context.ui.state === 'hidden' ? [] : [{ slot, context }];
  });
  return shown.flatMap(({ slot, context }, at): ToolbarItem[] => {
    const split = at > 0 && shown[at - 1]?.slot.group !== slot.group;
    return [...(split ? [{ kind: 'separator' as const, id: `before-${slot.group}`, label: groupName(slot) }] : []), slotItem(slot, context)];
  });
};

export { railItems };
