/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { ExportPlan } from '../../../export/export.type';
import { previewSource } from '../../../export/preview-source';

const usePreviewSource = (plan: ExportPlan | null): string | null => useMemo(() => previewSource(plan), [plan]);

export { usePreviewSource };
