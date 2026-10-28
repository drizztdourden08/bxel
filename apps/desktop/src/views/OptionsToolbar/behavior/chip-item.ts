/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import type { MenuGroup, ToolbarButton } from '@drizztdourden08/tessera';
import { createElement } from 'react';
import { shownMember } from '../../../editor/tool-catalogue/shown-member';
import type { ToolSlot } from '../../../editor/tool-catalogue/tool-catalogue.type';
import { resetTool } from '../../../editor/tool-options/reset-tool';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { Surface } from '../../../surface/surface.type';
import { flyoutGroups } from '../../../tool-menu/flyout-groups';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { flyoutSections } from '../../../tool-menu/flyout-sections';
import { OPTIONS_WIDGET_ID, TOOL_MENU_TEXT } from '../../../tool-menu/tool-menu.constants';
import { SlotIcon } from '../../SlotIcon';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';

const chipGroups = (slot: ToolSlot, surface: Surface): MenuGroup[] => {
  const sections = flyoutSections(flyoutModel(slot, surface), false).filter((section) => section.id === 'presets');
  const footer = [
    { id: 'reset', label: TOOL_MENU_TEXT.resetOptions, icon: 'rotate-ccw' as const, onSelect: () => resetTool(slot.tool) },
    { id: 'panel', label: TOOL_MENU_TEXT.optionsPanel, icon: 'panel-right' as const, onSelect: () => useWidgetLayoutStore.getState().open(OPTIONS_WIDGET_ID) },
  ];
  return [...flyoutGroups(sections), { id: 'chip-footer', items: footer }];
};

const chipItem = (slot: ToolSlot, surface: Surface): ToolbarButton => {
  const model = flyoutModel(slot, surface);
  const { shape, filled } = useToolStore.getState();
  const member = shownMember(slot, { shape, variant: useSelectionStore.getState().variant });
  const preset = model.matched?.name ?? OPTIONS_TEXT.custom;
  const named = surface === 'map' ? member.label : OPTIONS_TEXT.chipLabel(member.label, preset);
  return {
    kind: 'button',
    id: 'tool-chip',
    label: named,
    description: OPTIONS_TEXT.chipDescription,
    icon: createElement(SlotIcon, { member, filled: slot.tool === 'shape' && filled, mark: null, badge: null }),
    caption: named,
    options: chipGroups(slot, surface),
    openOn: 'click',
    onSelect: () => undefined,
  };
};

export { chipItem };
