/* @layer renderer-app @kind logic */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_DIR, PROJECT_PARENT, TEMP_PREFIX } from './e2e.constants';
import { openMcpRig } from './open-mcp-rig';
import type { ProjectRig } from './project-rig.type';

const openProjectRig = async (): Promise<ProjectRig> => {
  const mcp = await openMcpRig();
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const projectDir = await mkdtemp(join(parent, TEMP_PREFIX));
  const close = mcp.session.close;
  return { ...mcp, projectDir, session: { ...mcp.session, close: () => close().then(() => rm(projectDir, { recursive: true, force: true })) } };
};

export { openProjectRig };
