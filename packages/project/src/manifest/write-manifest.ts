/* @layer core @kind logic */
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { manifestFailure } from './manifest-failure';
import { manifestSchema } from './manifest-schema';
import type { ProjectManifest } from './manifest.type';
import { orderManifest } from './order-manifest';

const writeManifest = (manifest: ProjectManifest): ProjectResult<string> => {
  const checked = manifestSchema.safeParse(manifest);
  if (!checked.success) return manifestFailure(checked.error);
  return projectOk(`${JSON.stringify(orderManifest(checked.data), null, 2)}\n`);
};

export { writeManifest };
