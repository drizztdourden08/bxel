/* @layer core @kind logic */
import { z } from 'zod';
import { isProjectId } from './is-project-id';
import type { ProjectId } from './id.type';

const projectIdSchema = z.custom<ProjectId>(isProjectId, { message: 'A project id looks like prj_8d2k4m6q9x1v.' });

export { projectIdSchema };
