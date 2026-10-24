/* @layer renderer-app @kind types */
import type { ProjectDocument, RecentProject } from '@bxel/project';
import type { OpenProject, ProjectFolderState, ProjectPort } from '../project/project.type';

interface ProjectState {
  project: OpenProject | null;
  port: ProjectPort | null;
  recents: readonly RecentProject[];
  dialog: boolean;
  settingsDialog: boolean;
  held: readonly OpenProject[];
  open: (project: OpenProject) => void;
  close: () => void;
  update: (manifest: ProjectDocument) => void;
  markGranted: (folderId: string) => void;
  setPort: (port: ProjectPort | null) => void;
  setRecents: (recents: readonly RecentProject[]) => void;
  showDialog: (shown: boolean) => void;
  showSettings: (shown: boolean) => void;
  setFolders: (folders: readonly ProjectFolderState[]) => void;
  setHeld: (held: readonly OpenProject[]) => void;
}

export type { ProjectState };
