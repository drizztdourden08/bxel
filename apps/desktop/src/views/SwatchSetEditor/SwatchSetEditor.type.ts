/* @layer renderer-app @kind types */
import type { SwatchSet, SwatchSetId } from '@bxel/project';
import type { SourceGroup } from '../../palette-source/palette-source.type';

interface EditorState {
  sets: readonly SwatchSet[];
  current: SwatchSet | null;
  index: number;
  error: string | null;
  select: (setId: SwatchSetId) => void;
  pick: (index: number) => void;
  commit: (next: SwatchSet) => boolean;
  remove: (setId: SwatchSetId) => void;
  report: (message: string | null) => void;
}

interface SetCommands {
  create: () => void;
  rename: (name: string) => void;
  addColor: () => void;
  recolor: (rgb: string, alpha: number) => void;
  nameColor: (name: string) => void;
  removeColor: () => void;
}

interface SetSources {
  groups: SourceGroup[];
  hasProject: boolean;
  importFile: () => void;
  copyFrom: (key: string) => void;
  copyToProject: () => void;
}

interface SwatchSetEditorModel extends EditorState, SetCommands, SetSources {}

interface SetBarProps {
  model: SwatchSetEditorModel;
}

interface ColorCellProps {
  rgb: string;
  alpha: number;
  label: string;
  selected: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (rgb: string, alpha: number) => void;
}

export type { ColorCellProps, EditorState, SetBarProps, SetCommands, SetSources, SwatchSetEditorModel };
