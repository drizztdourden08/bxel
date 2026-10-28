/* @layer renderer-app @kind constants */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { SubjectCard } from '../views/SubjectCard';

const SUBJECT_META: { readonly preview: () => ReactNode; readonly previewPlacement: 'start'; readonly previewLabel: string } = {
  preview: () => createElement(SubjectCard),
  previewPlacement: 'start',
  previewLabel: 'File',
};

export { SUBJECT_META };
