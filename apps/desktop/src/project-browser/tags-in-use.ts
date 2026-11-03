/* @layer renderer-app @kind logic */
import type { ProjectOrganise } from '@bxel/project';

const tagsInUse = (organise: ProjectOrganise): string[] => [...new Set(Object.values(organise.tags).flat())].sort((a, b) => a.localeCompare(b));

export { tagsInUse };
