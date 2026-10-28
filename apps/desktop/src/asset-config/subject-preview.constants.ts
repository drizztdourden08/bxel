/* @layer renderer-app @kind constants */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { SubjectCard } from '../views/SubjectCard';

/** The meta of a Properties page that shows the subject card beside its rows. */
const SUBJECT_META: { readonly preview: () => ReactNode; readonly previewPlacement: 'start'; readonly previewLabel: string } = {
  preview: () => createElement(SubjectCard),
  previewPlacement: 'start',
  previewLabel: 'File',
};

export { SUBJECT_META };
