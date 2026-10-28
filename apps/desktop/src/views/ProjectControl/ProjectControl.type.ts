/* @layer renderer-app @kind types */
import type { FolderRole } from '@bxel/project';

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

export type { FoldersModel, PaletteFileRow, ProjectControlProps, RoleFieldProps };
