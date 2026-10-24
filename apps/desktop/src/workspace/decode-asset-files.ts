/* @layer renderer-app @kind logic */
import { ASSET_DECODERS } from './decoders.constants';
import { DECODE_ORDER } from './workspace.constants';
import type { AssetFile, DecodedFile, DecodedFiles, FileReport } from './workspace.type';

const decodeAssetFiles = (files: readonly AssetFile[]): DecodedFiles => {
  const sources: DecodedFile[] = [];
  const reports: FileReport[] = [];
  for (const group of DECODE_ORDER) {
    for (const file of files.filter((each) => group.includes(each.manifest.kind))) {
      const decode = ASSET_DECODERS[file.manifest.kind];
      if (!decode) continue;
      const { report, relinked } = decode(file, sources);
      reports.push({ path: file.path, report });
      if (report.slice) sources.push({ path: file.path, slice: report.slice, relinked: relinked || report.missingLinks.length > 0 });
    }
  }
  return { sources, reports };
};

export { decodeAssetFiles };
