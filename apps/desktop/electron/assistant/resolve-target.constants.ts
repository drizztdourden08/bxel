/* @layer electron-main @kind constants */
import type { FileKind } from '@bxel/project';

const EXPORT_KIND: Readonly<Record<string, FileKind>> = { gif: 'gif', 'atlas-json': 'sheet' };

export { EXPORT_KIND };
