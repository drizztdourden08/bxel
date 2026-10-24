/* @layer renderer-app @kind types */
import type { OpenProject } from '../../project/project.type';

type ProjectSettingsModel = {
  readonly project: OpenProject;
  readonly error: string | null;
  readonly busy: boolean;
  readonly add: () => void;
  readonly remove: (folderId: string) => void;
  readonly hide: () => void;
};

export type { ProjectSettingsModel };
