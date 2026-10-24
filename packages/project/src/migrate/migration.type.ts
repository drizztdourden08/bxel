/* @layer core @kind types */
import type { AssetSlice, IdSource } from '@bxel/document';
import type { SwatchSetId } from '../ids/id.type';
import type { ProjectDocument } from '../project-document/project-document.type';
import type { FolderLocation } from '../manifest/manifest.type';

type PalettePlan = {
  readonly setId: SwatchSetId;
  readonly location: FolderLocation;
  readonly slice: AssetSlice;
};

type MigrationOptions = {
  readonly ids: IdSource;
  readonly sourceFileName?: string;
};

type MigrationPlan = {
  readonly manifest: ProjectDocument;
  readonly projectFileName: string;
  readonly createFolders: readonly FolderLocation[];
  readonly palettes: readonly PalettePlan[];
  readonly trash: string;
};

export type { MigrationOptions, MigrationPlan, PalettePlan };
