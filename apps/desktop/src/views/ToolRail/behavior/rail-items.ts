/* @layer renderer-app @kind logic */
import type { ToolbarItem, ToolbarToggle } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { SlotIcon } from '../../SlotIcon';
import type { SlotIconProps } from '../../SlotIcon/SlotIcon.type';
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
    label: slotLabel(slot, context),
    description: slotDescription(context),
    shortcut: context.keys,
    icon: createElement(SlotIcon, { member: context.shown, filled: context.filled, mark: slotMark(slot, context), badge: context.badge }),
    options: off ? undefined : context.groups,
    pressed: context.active === slot.tool && !off,
    disabled: off,
    onChange: () => context.pick(slot),
  };
};

const railItems = (slots: readonly ToolSlot[], contextOf: (slot: ToolSlot) => SlotItemContext): ToolbarItem[] => {
  const shown = slots.flatMap((slot) => {
    const context = contextOf(slot);
    return context.ui.state === 'hidden' ? [] : [{ slot, context }];
  });
  return shown.flatMap(({ slot, context }, at): ToolbarItem[] => {
    const split = at > 0 && shown[at - 1]?.slot.group !== slot.group;
    return [...(split ? [{ kind: 'separator' as const, id: `before-${slot.group}` }] : []), slotItem(slot, context)];
  });
};

export { railItems };
