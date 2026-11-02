/* @layer renderer-app @kind logic */
import { PREVIEW_SCALES } from '../../../stores/preview-store.constants';
import type { PreviewScale } from '../../../stores/preview-store.type';

const previewScaleOf = (value: string): PreviewScale => PREVIEW_SCALES.find((scale) => String(scale) === value) ?? 1;

export { previewScaleOf };
