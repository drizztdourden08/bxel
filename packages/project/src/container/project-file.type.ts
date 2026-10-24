/* @layer core @kind types */
import type { ProjectDocument } from '../project-document/project-document.type';

type ProjectFileInput = {
  readonly manifest: ProjectDocument;
  readonly preview: Uint8Array | null;
  readonly assets: ReadonlyMap<string, Uint8Array>;
};

type DecodedProject = {
  readonly manifest: ProjectDocument;
  readonly preview: Uint8Array | null;
  readonly assets: ReadonlyMap<string, Uint8Array>;
  readonly savedAt: string;
};

export type { DecodedProject, ProjectFileInput };
