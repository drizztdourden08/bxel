/* @layer renderer-app @kind types */
import type { ProjectManifest, RecentProject } from '@bxel/project';
import type { OpenProject, ProjectPort } from '../project/project.type';

interface ProjectState {
  project: OpenProject | null;
  port: ProjectPort | null;
  recents: readonly RecentProject[];
  dialog: boolean;
  open: (project: OpenProject) => void;
  close: () => void;
  update: (manifest: ProjectManifest) => void;
  markGranted: (folderId: string) => void;
  setPort: (port: ProjectPort | null) => void;
  setRecents: (recents: readonly RecentProject[]) => void;
  showDialog: (shown: boolean) => void;
}

export type { ProjectState };
