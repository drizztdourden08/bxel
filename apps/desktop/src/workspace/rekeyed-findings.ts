/* @layer renderer-app @kind logic */
import { fileName } from '../files/file-name';
import type { FileFinding } from '../project-health/project-health.type';
import type { RekeyedFile } from './workspace.type';

const rekeyedFindings = (files: readonly RekeyedFile[]): readonly FileFinding[] =>
  files.map((file) => ({ fix: `rekeyed:${file.path}`, path: file.path, name: fileName(file.path), kind: file.kind }));

export { rekeyedFindings };
