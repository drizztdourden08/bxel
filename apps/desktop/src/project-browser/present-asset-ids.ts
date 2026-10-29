/* @layer renderer-app @kind logic */
import type { FileEntry } from './project-browser.type';

const presentAssetIds = (files: readonly FileEntry[]): ReadonlySet<string> => new Set(files.flatMap((entry) => (entry.row.assetId === null ? [] : [entry.row.assetId])));

export { presentAssetIds };
