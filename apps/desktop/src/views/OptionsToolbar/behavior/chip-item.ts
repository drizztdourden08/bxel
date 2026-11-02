/* @layer renderer-app @kind logic */
import type { MenuGroup, ToolbarButton } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { shownMember } from '../../../editor/tool-catalogue/shown-member';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { resetTool } from '../../../editor/tool-options/reset-tool';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { Surface } from '../../../editor/tool-catalogue/surface.type';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { TOOL_MENU_TEXT } from '../../../tool-menu/tool-menu.constants';
import { SlotIcon } from '../../SlotIcon';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';
import type { ChipOptions } from '../OptionsToolbar.type';
import { chipMenu } from './chip-menu';

const chipGroups = (slot: ToolSlot, surface: Surface, options: ChipOptions): MenuGroup[] => {
  const footer = [{ id: 'reset', label: TOOL_MENU_TEXT.resetOptions, icon: 'rotate-ccw' as const, onSelect: () => resetTool(slot.tool) }];
  return [...chipMenu(flyoutModel(slot, surface), options.everyTool), { id: 'chip-footer', items: footer }];
};

const chipItem = (slot: ToolSlot, surface: Surface, options: ChipOptions): ToolbarButton => {
  const model = flyoutModel(slot, surface);
  const filled = slot.tool === 'rect' || slot.tool === 'ellipse' ? useDrawingStore.getState().filled[slot.tool] : false;
  const member = shownMember(slot, { variant: useSelectionStore.getState().variant });
  const preset = model.matched?.name ?? OPTIONS_TEXT.custom;
  const named = surface === 'map' ? member.label : OPTIONS_TEXT.chipLabel(member.label, preset);
  return {
    kind: 'button',
    id: 'tool-chip',
    label: named,
    description: OPTIONS_TEXT.chipDescription,
    icon: createElement(SlotIcon, { member, filled, mark: null, badge: null }),
    caption: named,
    options: chipGroups(slot, surface, options),
    openOn: 'click',
    onSelect: () => undefined,
  };
};

export { chipItem };
