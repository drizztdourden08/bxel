/* @layer renderer-app @kind logic */
import { ASSET_DECODERS } from './decoders.constants';
import { decodedPool } from './decoded-pool';
import { nameFromFile } from './name-from-file';
import { addToPool } from './pool-add';
import { DECODE_ORDER } from './workspace.constants';
import type { AssetFile, DecodedFiles, FileReport } from './workspace.type';

const decodeAssetFiles = (files: readonly AssetFile[]): DecodedFiles => {
  const pool = decodedPool();
  const reports: FileReport[] = [];
  for (const group of DECODE_ORDER) {
    for (const file of files.filter((each) => group.includes(each.manifest.kind))) {
      const decode = ASSET_DECODERS[file.manifest.kind];
      if (!decode) continue;
      const { report, relinked } = decode(file, pool);
      reports.push({ path: file.path, report });
      const slice = report.slice ? nameFromFile(file.path, report.slice) : null;
      if (report.slice) {
        addToPool(pool, { path: file.path, slice: slice ?? report.slice, relinked: relinked || slice !== null || report.missingLinks.length > 0 });
      }
    }
  }
  return { sources: pool.all, reports };
};

export { decodeAssetFiles };
