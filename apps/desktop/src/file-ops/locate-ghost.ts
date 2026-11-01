/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import type { AssetRow } from '../asset-list/asset-list.type';
import { fileKit } from '../files/file-kit';
import { fileName } from '../files/file-name';
import { followFileRename } from '../workspace/follow-file-rename';
import { kindOfLinkPath } from '../workspace/kind-of-link-path';
import { toSlashes } from '../workspace/to-slashes';
import { ASSET_FILE_LABEL, GRANT_LEVELS } from '../workspace/workspace.constants';
import { affectedBy } from './affected-by';
import { FILE_OPS_TEXT } from './file-ops.constants';
import { heldAssetsUnder } from './held-assets';
import { rewriteLinks } from './rewrite-links';

const locateGhost = async (row: AssetRow): Promise<void> => {
  const kit = fileKit();
  const kind = kindOfLinkPath(row.path);
  if (kit === null || kind === null) {
    toast(FILE_OPS_TEXT.locateUnavailable, { variant: 'danger' });
    return;
  }
  const extension = ASSET_FORMAT[kind].extension;
  const picked = await kit.documents.open({
    title: FILE_OPS_TEXT.locateTitle,
    filters: [{ name: ASSET_FILE_LABEL[kind], extensions: [extension.slice(1)] }],
    grantFolder: { ask: true, levels: GRANT_LEVELS },
  });
  if (picked === null) return;
  const to = toSlashes(picked.path);
  if (!to.toLowerCase().endsWith(extension)) {
    toast(FILE_OPS_TEXT.locateWrongKind(extension), { variant: 'danger' });
    return;
  }
  const from = toSlashes(row.path);
  const affected = affectedBy(heldAssetsUnder(from));
  followFileRename(from, to);
  const links = await rewriteLinks(kit, [{ from, to }], affected);
  toast(links > 0 ? FILE_OPS_TEXT.locatedLinks(fileName(to), links) : FILE_OPS_TEXT.located(fileName(to)), { variant: 'success' });
};

export { locateGhost };
