/* @layer core @kind types */
import type { Project } from '../model/project.type';

type ContainerParts = {
  readonly project: Project;
  readonly savedAt: number;
  readonly documentBytes: Uint8Array;
  readonly preview: Uint8Array | null;
  readonly blobs: ReadonlyMap<string, Uint8Array>;
};

export type { ContainerParts };
