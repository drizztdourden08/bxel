/* @layer core @kind logic */
import { z } from 'zod';
import { projectIdSchema } from '../ids/project-id-schema';
import { isValidSegment } from '../paths/is-valid-segment';
import { PATH_LIMITS } from '../paths/path.constants';
import { MAX_SWATCH_SETS } from '../swatches/swatch.constants';
import { swatchSetSchema } from '../swatches/swatch-set-schema';
import { checkManifestFolders } from './check-manifest-folders';
import { checkManifestSettings } from './check-manifest-settings';
import { checkManifestSwatchSets } from './check-manifest-swatch-sets';
import { folderSchema } from './folder-schema';
import { ACCESS_LEVELS, MANIFEST_FORMAT, MANIFEST_VERSION } from './manifest.constants';
import { settingsSchema } from './settings-schema';

const projectNameSchema = z
  .string()
  .max(PATH_LIMITS.maxProjectName)
  .refine(isValidSegment, { message: 'A project name follows the file name rule, up to 53 characters.' });

const manifestSchema = z
  .strictObject({
    format: z.literal(MANIFEST_FORMAT),
    formatVersion: z.literal(MANIFEST_VERSION),
    projectId: projectIdSchema,
    name: projectNameSchema,
    folders: z.array(folderSchema).min(1).max(PATH_LIMITS.maxFolders),
    settings: settingsSchema,
    swatchSets: z.array(swatchSetSchema).max(MAX_SWATCH_SETS).default([]),
    assistant: z.strictObject({ access: z.enum(ACCESS_LEVELS) }),
  })
  .superRefine((manifest, context) => {
    const issues = [
      ...checkManifestFolders(manifest.folders),
      ...checkManifestSettings(manifest.settings, manifest.folders),
      ...checkManifestSwatchSets(manifest.swatchSets),
    ];
    for (const issue of issues) context.addIssue({ code: 'custom', ...issue });
  });

export { manifestSchema };
