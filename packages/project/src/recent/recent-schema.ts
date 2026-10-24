/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_GRANT_STAMP, MAX_ROOT_PATH } from '../grant/grant.constants';
import { projectIdSchema } from '../ids/project-id-schema';
import { PATH_LIMITS } from '../paths/path.constants';

const recentSchema = z.strictObject({
  projectId: projectIdSchema,
  name: z.string().min(1).max(PATH_LIMITS.maxProjectName),
  rootRealPath: z.string().min(1).max(MAX_ROOT_PATH),
  openedAt: z.string().min(1).max(MAX_GRANT_STAMP),
});

export { recentSchema };
