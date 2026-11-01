/* @layer renderer-app @kind types */
import type { FileFinding } from '../../../project-health/project-health.type';

type FileRowsProps = { readonly findings: readonly FileFinding[]; readonly show: (path: string) => void };

export type { FileRowsProps };
