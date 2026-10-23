/* @layer core @kind types */
import type { BuiltProject } from './built-project.type';
import type { EntryCheck } from './entry-check.type';
import type { OpenedContainer } from './opened-container.type';
import type { ReadDocument } from './read-document.type';

type ReportParts = {
  readonly opened: OpenedContainer;
  readonly read: ReadDocument;
  readonly built: BuiltProject;
  readonly check: EntryCheck;
};

export type { ReportParts };
