/* @layer renderer-app @kind logic */
import type { QuickKind } from './quick-palette.type';

const quickId = (kind: QuickKind, id: string): string => `${kind}:${id}`;

export { quickId };
