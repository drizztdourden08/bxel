/* @layer renderer-app @kind logic */
import { focusedProject } from '../project-config/focused-project';
import { PROJECT_FIELDS } from '../project-config/project-fields.constants';
import { MANAGER_TEXT } from './project-manager.constants';

const renameOpenProject = async (name: string): Promise<string | null> => {
  const focus = focusedProject();
  const field = PROJECT_FIELDS['project.name'];
  const typed = name.trim();
  if (typed === '') return MANAGER_TEXT.nameEmpty;
  if (!focus || !field?.write) return MANAGER_TEXT.renameFailed;
  return (await field.write(focus, typed)) ?? null;
};

export { renameOpenProject };
