/* @layer renderer-app @kind logic */
import type { ProjectCover, ProjectDocument } from '@bxel/project';

const withCover = (manifest: ProjectDocument, cover: ProjectCover | null): ProjectDocument => ({
  format: manifest.format,
  formatVersion: manifest.formatVersion,
  projectId: manifest.projectId,
  name: manifest.name,
  ...(cover === null ? {} : { cover }),
  folders: manifest.folders,
  defaults: manifest.defaults,
  assistant: manifest.assistant,
});

export { withCover };
