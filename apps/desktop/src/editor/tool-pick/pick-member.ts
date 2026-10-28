/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useToolStore } from '../../stores/useToolStore';
import type { ToolMember } from '../tool-catalogue/tool-catalogue.type';

const pickMember = (member: ToolMember): void => {
  const tools = useToolStore.getState();
  const { variant } = member;
  if (variant?.kind === 'shape') tools.setShape(variant.value);
  if (variant?.kind === 'select') useSelectionStore.getState().setVariant(variant.value);
  tools.setTool(member.tool);
};

export { pickMember };
