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

type ManifestParts = {
  readonly project: ProjectDocument;
  readonly savedAt: number;
  readonly documentBytes: Uint8Array;
  readonly preview: Uint8Array | null;
  readonly assets: ReadonlyMap<string, Uint8Array>;
};

export type { DecodedProject, ManifestParts, ProjectFileInput };
