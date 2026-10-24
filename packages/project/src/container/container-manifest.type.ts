/* @layer core @kind types */
import type { z } from 'zod';
import type { containerManifestSchema } from './container-manifest-schema';

type ContainerManifest = z.infer<typeof containerManifestSchema>;

export type { ContainerManifest };
