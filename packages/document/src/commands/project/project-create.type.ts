/* @layer core @kind types */
import type { DocumentState } from '../../model/project.type';
import type { CommandError } from '../command-error.type';

type ProjectCreateResult =
  | { readonly ok: true; readonly state: DocumentState }
  | { readonly ok: false; readonly error: CommandError };

export type { ProjectCreateResult };
