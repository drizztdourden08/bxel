/* @layer core @kind types */
import type { FILE_EXTENSIONS } from './path.constants';

type FileKind = keyof typeof FILE_EXTENSIONS;

type PathParts = {
  readonly prefix: string;
  readonly rest: string;
};

export type { FileKind, PathParts };
