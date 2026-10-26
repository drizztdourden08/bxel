/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AssetFocus } from '../asset-config/asset-config.type';
import { EXPORT_KIND_OF } from '../asset-list/export-row.constants';
import { openAnimationExport } from '../export/open-animation-export';
import { openExport } from '../export/open-export';

const exportFocused = (focus: AssetFocus): void => {
  const kind = EXPORT_KIND_OF[focus.key.kind];
  if (kind === undefined) return;
  nav.close();
  if (kind === 'animation') openAnimationExport(focus.key.id);
  else openExport(kind);
};

export { exportFocused };
