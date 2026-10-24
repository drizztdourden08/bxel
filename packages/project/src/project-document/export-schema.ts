/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_EXPORT_LIMITS, TEMPLATE_PATTERN } from './project-document.constants';

const exportSchema = z.strictObject({
  scale: z.number().int().min(PROJECT_EXPORT_LIMITS.scaleMin).max(PROJECT_EXPORT_LIMITS.scaleMax).optional(),
  pathTemplate: z.string().min(1).max(PROJECT_EXPORT_LIMITS.templateMax).regex(TEMPLATE_PATTERN).optional(),
});

export { exportSchema };
