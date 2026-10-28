/* @layer renderer-app @kind logic */
import { optionById } from '../tool-options/option-by-id';
import { writeOption } from '../tool-options/write-option';
import { memberById } from '../tool-catalogue/member-by-id';
import { pickMember } from '../tool-pick/pick-member';
import type { ToolPreset } from './tool-preset.type';

const applyPreset = (preset: ToolPreset): boolean => {
  const found = memberById(preset.member);
  if (!found) return false;
  pickMember(found.member);
  for (const [id, value] of Object.entries(preset.fields)) {
    const spec = optionById(id);
    if (spec) writeOption(spec, value);
  }
  return true;
};

export { applyPreset };
