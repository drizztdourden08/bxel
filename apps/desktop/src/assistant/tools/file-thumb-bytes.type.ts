/* @layer renderer-app @kind types */
import type { diskThumb } from '../../asset-thumbs/disk-thumb';

type ThumbKind = Parameters<typeof diskThumb>[1]['kind'];

export type { ThumbKind };
