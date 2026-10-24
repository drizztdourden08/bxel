/* @layer renderer-app @kind logic */
import type { AssetDirs } from './workspace.type';

const sameDirs = (dir: string): AssetDirs => ({ sprite: dir, sheet: dir, palette: dir, tileset: dir, tilemap: dir });

export { sameDirs };
