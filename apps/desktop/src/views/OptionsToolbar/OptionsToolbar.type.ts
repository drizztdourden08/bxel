/* @layer renderer-app @kind types */
import type { ToolbarSlot } from '@drizztdourden08/tessera';
import type { Surface } from '../../editor/tool-catalogue/surface.type';
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';

interface OptionsToolbarProps {
  slot: ToolbarSlot;
}

interface ScopeInput {
  surface: Surface;
  tileUses: number | null;
  broadcast: boolean;
  selected: number;
}

interface ChipOptions {
  everyTool: boolean;
}

interface MoreOptionsProps {
  specs: readonly OptionSpec[];
  onOpenPanel: () => void;
}

export type { ChipOptions, MoreOptionsProps, OptionsToolbarProps, ScopeInput };
