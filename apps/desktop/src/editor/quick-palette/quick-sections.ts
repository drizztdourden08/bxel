/* @layer renderer-app @kind logic */
import type { PaletteItem, PaletteSection } from '@drizztdourden08/tessera';
import type { ToolPreset } from '../presets/tool-preset.type';
import { memberById } from '../tool-catalogue/member-by-id';
import { slotsOf } from '../tool-catalogue/slots-of';
import { SLOT_GROUPS } from '../tool-catalogue/tool-catalogue.constants';
import type { ToolMember } from '../tool-catalogue/tool-catalogue.type';
import { quickId } from './make-quick-id';
import { QUICK_TEXT } from './quick-palette.constants';
import type { QuickInput, QuickKind } from './quick-palette.type';

const memberItem = (kind: QuickKind, member: ToolMember, input: QuickInput): PaletteItem => {
  const keys = input.keysOf(member.tool);
  return { id: quickId(kind, member.id), icon: { name: member.icon }, label: member.label, ...(keys ? { shortcut: keys } : {}) };
};

const presetItem = (preset: ToolPreset): PaletteItem[] => {
  const found = memberById(preset.member);
  return found ? [{ id: quickId('preset', preset.id), icon: { name: found.member.icon }, label: preset.name }] : [];
};

const groupSections = (input: QuickInput): PaletteSection[] => {
  const slots = slotsOf(input.surface);
  return SLOT_GROUPS.flatMap((group) => {
    const members = slots.filter((slot) => slot.group === group.id).flatMap((slot) => slot.members);
    return members.length === 0 ? [] : [{ id: group.id, label: group.label, items: members.map((member) => memberItem('tool', member, input)) }];
  });
};

const quickSections = (input: QuickInput): PaletteSection[] => {
  const recent = input.recent.flatMap((id) => memberById(id)?.member ?? []);
  const presets = input.presets.flatMap(presetItem);
  return [
    ...groupSections(input),
    ...(recent.length === 0 ? [] : [{ id: 'recent', label: QUICK_TEXT.recent, items: recent.map((member) => memberItem('recent', member, input)) }]),
    ...(presets.length === 0 ? [] : [{ id: 'presets', label: QUICK_TEXT.presets, items: presets }]),
  ];
};

export { quickSections };
