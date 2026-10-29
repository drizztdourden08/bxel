/* @layer renderer-app @kind logic */
import { relativeInside } from '@bxel/project';
import type { OpenProject } from '../project/project.type';
import { toSlashes } from '../workspace/to-slashes';

const projectRelative = (project: OpenProject | null, path: string): string => {
  const slashed = toSlashes(path);
  const found = project?.folders.flatMap((folder, at) => {
    const inside = relativeInside(toSlashes(folder.path), slashed);
    if (inside === undefined) return [];
    return [at === 0 || inside === '' ? inside : `${folder.name}/${inside}`];
  });
  return found?.[0] ?? slashed;
};

export { projectRelative };
