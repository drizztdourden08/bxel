/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { FolderRole } from '@bxel/project';
import { ROLE_FOLDER_LABEL, ROLE_FOLDER_TEXT } from './role-folder.constants';
import type { ProjectOutcomeText } from './project-config.type';

const roleReporter = (folderPath: string) => (outcome: ProjectOutcomeText, role: FolderRole): void => {
  if (outcome !== null) {
    toast(outcome, { variant: 'danger' });
    return;
  }
  const name = folderPath.split(/[\\/]/).filter((part) => part !== '').at(-1) ?? folderPath;
  toast(ROLE_FOLDER_TEXT.done(name, ROLE_FOLDER_LABEL[role]), { variant: 'success' });
};

export { roleReporter };
