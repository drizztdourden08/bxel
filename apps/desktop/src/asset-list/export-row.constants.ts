/* @layer renderer-app @kind constants */
import type { ExportKind } from '../export/export.type';

const EXPORT_KIND_OF: Readonly<Record<string, ExportKind>> = { sprite: 'sprite', animation: 'animation', sheet: 'sheet', tilemap: 'map' };

export { EXPORT_KIND_OF };
