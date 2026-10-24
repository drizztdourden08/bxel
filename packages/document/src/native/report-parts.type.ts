/* @layer core @kind types */
import type { BuiltArtwork } from './built-artwork.type';
import type { EntryCheck } from './entry-check.type';
import type { OpenedContainer } from './opened-container.type';
import type { ReadDocument } from './read-document.type';

type ReportParts = {
  readonly opened: OpenedContainer;
  readonly read: ReadDocument;
  readonly built: BuiltArtwork;
  readonly check: EntryCheck;
};

export type { ReportParts };
