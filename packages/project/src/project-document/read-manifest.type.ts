/* @layer core @kind types */
import type { ProjectManifest } from '../manifest/manifest.type';
import type { ProjectDocument } from './project-document.type';

type ReadManifest =
  | { readonly version: 1; readonly manifest: ProjectManifest }
  | { readonly version: 2; readonly manifest: ProjectDocument };

export type { ReadManifest };
