/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import { PROJECT_TEXT } from './project.constants';
import type { OpenProject } from './project.type';

const titleInProject = (name: string, path: string | undefined, project: OpenProject | null): string => {
  if (path === undefined || project === null) return name;
  const inside = project.folders.some((folder) => relativeInside(folder.path, path) !== undefined);
  return inside ? PROJECT_TEXT.inProject(name, project.manifest.name) : name;
};

export { titleInProject };
