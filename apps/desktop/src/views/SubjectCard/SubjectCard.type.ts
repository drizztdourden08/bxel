/* @layer renderer-app @kind types */
import type { Subject } from '../../properties-subject/properties-subject.type';

type SubjectPartProps = { readonly subject: Subject };

type FileSummaryProps = { readonly path: string };

export type { FileSummaryProps, SubjectPartProps };
