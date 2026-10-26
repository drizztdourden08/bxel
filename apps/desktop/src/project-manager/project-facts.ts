/* @layer renderer-app @kind logic */
import type { ProjectDocument } from '@bxel/project';
import { fileName } from '../files/file-name';
import { ACCESS_LABEL } from '../project/project.constants';
import { MANAGER_TEXT } from './project-manager.constants';
import type { ProjectFact } from './project-manager.type';

const projectFacts = (manifest: ProjectDocument, root: string, projectFile: string): readonly ProjectFact[] => {
  const { size, colorLimit } = manifest.defaults;
  return [
    { label: MANAGER_TEXT.location, value: root },
    { label: MANAGER_TEXT.projectFile, value: fileName(projectFile) },
    { label: MANAGER_TEXT.assistantAccess, value: ACCESS_LABEL[manifest.assistant.access] },
    { label: MANAGER_TEXT.folderCount, value: MANAGER_TEXT.folderSummary(manifest.folders.length) },
    { label: MANAGER_TEXT.defaultSize, value: size ? MANAGER_TEXT.sizeValue(size.width, size.height) : MANAGER_TEXT.appDefault },
    { label: MANAGER_TEXT.defaultColours, value: colorLimit === undefined ? MANAGER_TEXT.appDefault : String(colorLimit) },
  ];
};

export { projectFacts };
