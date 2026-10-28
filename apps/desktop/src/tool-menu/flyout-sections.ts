/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import { applyPreset } from '../editor/presets/apply-preset';
import { openSaveDraft } from '../editor/presets/open-save-draft';
import { resetTool } from '../editor/tool-options/reset-tool';
import { announcePreset } from '../editor/tool-pick/announce-preset';
import { pickMember } from '../editor/tool-pick/pick-member';
import { useToolPrefsStore } from '../stores/useToolPrefsStore';
import { optionSections } from './option-sections';
import { TOOL_MENU_TEXT, TOOLS_WIDGET_ID } from './tool-menu.constants';
import type { FlyoutModel, FlyoutRow, FlyoutSection } from './tool-menu.type';

const action = (id: string, label: string, icon: FlyoutRow['icon'], run: () => void): FlyoutRow => ({ id, label, icon, kind: 'action', checked: false, disabled: false, run });

const memberRows = (model: FlyoutModel): FlyoutRow[] =>
  model.members.length < 2
    ? []
    : model.members.map((member) => ({
        id: member.id,
        label: member.label,
        icon: member.icon,
        kind: 'radio',
        checked: member.id === model.shown.id,
        disabled: false,
        run: () => pickMember(member),
      }));

const presetRows = (model: FlyoutModel): FlyoutRow[] => [
  ...model.presets.map((preset): FlyoutRow => ({
    id: preset.id,
    label: preset.name,
    kind: 'radio',
    checked: model.matched?.id === preset.id,
    disabled: false,
    run: () => {
      if (applyPreset(preset)) announcePreset(preset);
    },
  })),
  action('save-preset', TOOL_MENU_TEXT.savePreset, 'save', () => {
    pickMember(model.shown);
    openSaveDraft();
  }),
];

const footerRows = (model: FlyoutModel): FlyoutRow[] => [
  action('reset', TOOL_MENU_TEXT.resetOptions, 'rotate-ccw', () => resetTool(model.slot.tool)),
  action('hide', model.hidden ? TOOL_MENU_TEXT.show : TOOL_MENU_TEXT.hide, model.hidden ? 'eye' : 'eye-off', () =>
    model.slot.members.forEach((member) => useToolPrefsStore.getState().toggleHidden(member.id)),
  ),
  action('panel', TOOL_MENU_TEXT.panel, 'panel-right', () => useWidgetLayoutStore.getState().open(TOOLS_WIDGET_ID)),
];

const flyoutSections = (model: FlyoutModel, withFooter: boolean): FlyoutSection[] => {
  const mapSlot = model.slot.surfaces.includes('map');
  return [
    { id: 'members', label: TOOL_MENU_TEXT.members, rows: memberRows(model) },
    ...optionSections(model.options),
    { id: 'presets', label: TOOL_MENU_TEXT.presets, rows: mapSlot ? [] : presetRows(model) },
    { id: 'footer', rows: withFooter ? footerRows(model) : [] },
  ].filter((section) => section.rows.length > 0);
};

export { flyoutSections };
