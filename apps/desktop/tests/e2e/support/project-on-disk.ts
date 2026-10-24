/* @layer renderer-app @kind logic */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { decodeProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';

const projectOnDisk = async (projectDir: string, name: string): Promise<ProjectDocument> => {
  const decoded = decodeProject(new Uint8Array(await readFile(join(projectDir, `${name}.bxproject`))));
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded.value.manifest;
};

export { projectOnDisk };
