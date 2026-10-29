/* @layer renderer-app @kind logic */
import type { ProjectDocument, ProjectOrganise } from '@bxel/project';
import { EMPTY_ORGANISE } from './organise.constants';

const organiseOf = (manifest: Pick<ProjectDocument, 'organise'> | null | undefined): ProjectOrganise => manifest?.organise ?? EMPTY_ORGANISE;

export { organiseOf };
