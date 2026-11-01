/* @layer renderer-app @kind logic */
import type { ToolMember } from '../tool-catalogue/tool-catalogue.type';
import { noteToolPick } from './note-tool-pick';
import { pickMember } from './pick-member';

const pointerPick = (member: ToolMember): void => {
  pickMember(member);
  noteToolPick(member.tool);
};

export { pointerPick };
