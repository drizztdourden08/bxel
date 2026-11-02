/* @layer renderer-app @kind types */
import type { FolderRole } from '@bxel/project';
import type { ProjectOutcomeText } from './project-config.type';

type RoleFolderOptions = {
  readonly folderPath: string;
  readonly current: readonly FolderRole[];
  readonly report: (outcome: ProjectOutcomeText, role: FolderRole) => void;
};

export type { RoleFolderOptions };
