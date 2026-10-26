/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { EXPORT_KIND_OF } from '../asset-list/export-row.constants';
import { openExport } from '../export/open-export';

const exportFocused = (focus: AssetFocus): void => {
  const kind = EXPORT_KIND_OF[focus.key.kind];
  if (kind === undefined) return;
  nav.close();
  openExport(kind);
};

export { exportFocused };
