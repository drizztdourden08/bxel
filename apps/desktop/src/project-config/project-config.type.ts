/* @layer renderer-app @kind types */
import type { Artwork, DocumentId } from '@bxel/document';
import type { ProjectDefaults, ProjectExport } from '@bxel/project';
import type { SourceField } from '../config-source/config-source.type';
import type { OpenProject } from '../project/project.type';

type ProjectFocus = {
  readonly project: OpenProject;
  readonly documentId: DocumentId | null;
  readonly artwork: Artwork | undefined;
  readonly paths: ReadonlyMap<string, string>;
};

type DefaultsPatch = { [K in keyof ProjectDefaults]: ProjectDefaults[K] | undefined };

type ExportPatch = { [K in keyof ProjectExport]: ProjectExport[K] | undefined };

type ProjectOutcomeText = string | null;

type ProjectField = SourceField<ProjectFocus>;

type FieldOutcome = Promise<ProjectOutcomeText> | ProjectOutcomeText;

type PaletteSeed = {
  readonly name: string;
  readonly cap: number;
  readonly transparent: boolean;
  readonly colors: readonly string[];
};

export type { DefaultsPatch, ExportPatch, FieldOutcome, PaletteSeed, ProjectField, ProjectFocus, ProjectOutcomeText };
