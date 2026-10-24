/* @layer core @kind types */
import type { ProjectDocument } from '../project-document/project-document.type';
import type { FolderLocation } from '../manifest/manifest.type';

type SkippedFile = {
  readonly path: string;
  readonly reason: string;
};

type PackOperation = {
  readonly kind: 'add';
  readonly from: FolderLocation;
  readonly entry: string;
};

type PackPlan = {
  readonly manifest: ProjectDocument;
  readonly operations: readonly PackOperation[];
  readonly skipped: readonly SkippedFile[];
};

type MkdirOperation = { readonly kind: 'mkdir'; readonly path: string };

type ExtractOperation = { readonly kind: 'extract'; readonly entry: string; readonly path: string };

type UnpackOperation = MkdirOperation | ExtractOperation;

type UnpackPlan = {
  readonly manifest: ProjectDocument;
  readonly root: string;
  readonly projectFile: string;
  readonly operations: readonly UnpackOperation[];
  readonly skipped: readonly SkippedFile[];
};

export type { ExtractOperation, MkdirOperation, PackOperation, PackPlan, SkippedFile, UnpackOperation, UnpackPlan };
