/* @layer core @kind types */
import type { ContainerManifest } from './container-manifest.type';

type ContainerEntry = ContainerManifest['entries'][number];

export type { ContainerEntry };
