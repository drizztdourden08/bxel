/* @layer electron-main @kind constants */
import type { FileKind } from '@bxel/project';

const EXPORT_KIND: Readonly<Record<string, FileKind>> = { gif: 'gif', 'atlas-json': 'sheet' };

const PALETTE_KIND: Readonly<Record<string, FileKind>> = { gpl: 'palette', pal: 'palette', hex: 'palette', txt: 'palette', ase: 'palette' };

export { EXPORT_KIND, PALETTE_KIND };
