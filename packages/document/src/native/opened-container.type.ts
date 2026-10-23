/* @layer core @kind types */
import type { ArchiveContents } from './archive.type';
import type { Manifest } from './manifest.type';

type OpenedContainer = {
  readonly archive: ArchiveContents;
  readonly manifest: Manifest;
  readonly readOnly: boolean;
  readonly notice: string | null;
};

export type { OpenedContainer };
