/* @layer renderer-app @kind types */
import type { ToolDef } from '../../editor/tool.type';

interface ToolButtonProps {
  def: ToolDef;
  active: boolean;
  onSelect: () => void;
}

export type { ToolButtonProps };
