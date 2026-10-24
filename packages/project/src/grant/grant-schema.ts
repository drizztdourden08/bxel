/* @layer core @kind logic */
import { z } from 'zod';
import { projectIdSchema } from '../ids/project-id-schema';
import { ACCESS_LEVELS } from '../manifest/manifest.constants';
import { MAX_GRANT_STAMP, MAX_ROOT_PATH } from './grant.constants';

const grantSchema = z.strictObject({
  projectId: projectIdSchema,
  rootRealPath: z.string().min(1).max(MAX_ROOT_PATH),
  access: z.enum(ACCESS_LEVELS),
  grantedAt: z.string().min(1).max(MAX_GRANT_STAMP),
});

export { grantSchema };
