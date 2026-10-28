/* @layer renderer-app @kind logic */
import type { ToolbarItem, ToolbarToggle } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { CATALOGUE_TEXT } from '../../../editor/tool-catalogue/tool-catalogue.constants';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { SlotIcon } from '../../SlotIcon';
import type { SlotItemContext, SlotMark } from '../ToolRail.type';

const slotLabel = (slot: ToolSlot, context: SlotItemContext): string =>
  slot.members.length > 1 ? `${slot.label}, ${context.shown.label}` : slot.label;

const slotMark = (slot: ToolSlot, context: SlotItemContext): SlotMark => {
  if (slot.members.length > 1) return 'corner';
  return context.hasFlyout ? 'dot' : null;
};

const slotDescription = (context: SlotItemContext): string =>
  context.disabled ? CATALOGUE_TEXT.disabled : [context.shown.description, context.badge?.text].filter(Boolean).join(' ');

const slotItem = (slot: ToolSlot, context: SlotItemContext): ToolbarToggle => ({
  kind: 'toggle',
  id: slot.id,
  label: slotLabel(slot, context),
  description: slotDescription(context),
  shortcut: context.keys,
  icon: createElement(SlotIcon, { member: context.shown, filled: context.filled, mark: slotMark(slot, context), badge: context.badge }),
  options: context.groups,
  pressed: context.active === slot.tool && !context.disabled,
  disabled: context.disabled,
  onChange: () => context.pick(slot),
});

const railItems = (slots: readonly ToolSlot[], contextOf: (slot: ToolSlot) => SlotItemContext): ToolbarItem[] =>
  slots.flatMap((slot, at): ToolbarItem[] => {
    const split = at > 0 && slots[at - 1]?.group !== slot.group;
    return [...(split ? [{ kind: 'separator' as const, id: `before-${slot.group}` }] : []), slotItem(slot, contextOf(slot))];
  });

export { railItems };
