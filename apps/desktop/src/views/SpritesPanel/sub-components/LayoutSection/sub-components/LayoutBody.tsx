/* @layer renderer-app @kind component */
import { Button, Callout, Checkbox, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { openExport } from '../../../../../export/open-export';
import { atlasExportSettings } from '../../../../../sheet-manager/atlas-export-settings';
import { atlasModel } from '../../../../../sheet-manager/atlas-model';
import { ATLAS_SIDE_LIMIT } from '../../../../../sheet-manager/manager.constants';
import { ATLAS_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { LayoutControls } from './LayoutControls';
import { LayoutPages } from './LayoutPages';

const LayoutBody = ({ model }: ManagerModelProps) => {
  const showExport = useManagerStore((state) => state.showExport);
  const settings = useManagerStore((state) => state.atlas);
  const patch = useManagerStore((state) => state.patch);
  const { sheet } = model;
  const { extrude, trim, powerOfTwo, rotate, pageSide, page } = settings;
  const atlas = useMemo(
    () => (sheet ? atlasModel({ sheet, artwork: model.artwork, extrude, trim, powerOfTwo, rotate, pageSide, page }) : null),
    [sheet, model.artwork, extrude, trim, powerOfTwo, rotate, pageSide, page],
  );
  if (!sheet) return null;
  return (
    <Stack gap="sm">
      <LayoutControls sheet={sheet} />
      <Checkbox label={ATLAS_TEXT.showExport} checked={showExport} onChange={(next) => patch({ showExport: next })} />
      {atlas && (
        <>
          <Text variant="caption" tone="dim" aria-live="polite">
            {ATLAS_TEXT.size(atlas.width, atlas.height, atlas.empty)}
          </Text>
          <LayoutPages page={atlas.page} count={atlas.pageCount} />
          {atlas.failure !== null && <Callout tone="warning">{atlas.failure}</Callout>}
          {Math.max(atlas.width, atlas.height) > ATLAS_SIDE_LIMIT && <Callout tone="warning">{ATLAS_TEXT.overLimit(ATLAS_SIDE_LIMIT)}</Callout>}
        </>
      )}
      <Button variant="secondary" size="sm" onClick={() => openExport('sheet', atlasExportSettings(sheet, settings))}>
        {ATLAS_TEXT.export}
      </Button>
    </Stack>
  );
};

export { LayoutBody };
