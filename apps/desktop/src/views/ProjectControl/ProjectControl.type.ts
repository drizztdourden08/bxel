/* @layer renderer-app @kind types */
import type { FolderRole } from '@bxel/project';
import type { SourceGroup } from '../../palette-source/palette-source.type';

interface ProjectControlProps {
  field: string;
}

interface PaletteFileRow {
  id: string;
  name: string;
  path: string;
  choice: string;
  users: number;
}

interface PalettesModel {
  files: readonly PaletteFileRow[];
  groups: SourceGroup[];
  busy: boolean;
  error: string | null;
  create: () => void;
  importFile: () => void;
  addFromLibrary: (key: string) => void;
  exportFile: (id: string) => void;
  open: (id: string) => void;
}

interface FoldersModel {
  error: string | null;
  busy: boolean;
  add: () => void;
  remove: (folderId: string) => void;
  setRole: (folderId: string, role: FolderRole, path: string) => void;
}

interface RoleFieldProps {
  role: FolderRole;
  value: string;
  onCommit: (path: string) => void;
}

export type { FoldersModel, PaletteFileRow, PalettesModel, ProjectControlProps, RoleFieldProps };
