/* @layer core @kind types */
import type { DocumentState } from '../../model/artwork.type';
import type { CommandError } from '../command-error.type';

type ArtworkCreateResult =
  | { readonly ok: true; readonly state: DocumentState }
  | { readonly ok: false; readonly error: CommandError };

export type { ArtworkCreateResult };
