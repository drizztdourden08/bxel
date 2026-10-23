/* @layer core @kind test */
import type { Project } from '@bxel/document';

const snapshotProject = (project: Project): string =>
  JSON.stringify(project, (_key, value: unknown) =>
    value instanceof Uint8Array ? Array.from(value).join('') : value,
  );

export { snapshotProject };
