/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';
import type { OpenProject } from '../../project/project.type';
import type { IndexedFile, IndexedLink } from '../../workspace/link-index.type';
import { locateInProject } from './locate-in-project';

const stem = (name: string): string => name.replace(/\.[^.]+$/, '');

const kindOf = (found: IndexedFile | null, link: IndexedLink): Exclude<AssetKind, 'project'> | null => {
  const kind = found?.kind ?? link.targetKind;
  return kind === 'project' ? null : kind;
};

const reference = (project: OpenProject, file: IndexedFile | null, link: IndexedLink) => {
  const found = file ?? link.found;
  return {
    assetId: found?.assetId ?? link.linkId,
    kind: kindOf(found, link),
    name: found?.name ?? stem(link.targetName),
    location: found === null ? null : locateInProject(project, found.path),
    state: link.state,
  };
};

export { reference };
