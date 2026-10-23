/* @layer core @kind test */
import type { DocumentState, Project } from '@bxel/document';
import { encodeProject } from '@bxel/document/native';
import type { LoadReport } from '@bxel/document/native';
import { heartEngine } from './heart-engine';

const heartPreview = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4]);
const fixedClock = (): number => Date.UTC(2026, 9, 22, 14, 3, 11);

const heartState = (): DocumentState => heartEngine().engine.state();

const encodeHeart = (state: DocumentState = heartState()): Uint8Array =>
  encodeProject(state, heartPreview, fixedClock);

const projectOf = (report: LoadReport): Project => {
  if (!report.project) throw new Error('The report has no project.');
  return report.project;
};

export { encodeHeart, fixedClock, heartPreview, heartState, projectOf };
