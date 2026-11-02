/* @layer renderer-app @kind types */
import type { FileSummaryData } from '../../../properties-subject/properties-subject.type';

type SummaryLoad = { readonly path: string; readonly data: FileSummaryData | null };

export type { SummaryLoad };
