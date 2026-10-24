/* @layer renderer-app @kind logic */
import type { ExportSettings } from './export.type';

const wantsMap = (settings: ExportSettings): boolean => settings.colour === 'indexed' && settings.kind !== 'animation';

export { wantsMap };
