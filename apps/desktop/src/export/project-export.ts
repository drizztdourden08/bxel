/* @layer renderer-app @kind logic */
import type { ProjectExport } from '@bxel/project';
import { useProjectStore } from '../stores/useProjectStore';

const projectExport = (): ProjectExport | undefined => useProjectStore.getState().project?.manifest.export;

export { projectExport };
