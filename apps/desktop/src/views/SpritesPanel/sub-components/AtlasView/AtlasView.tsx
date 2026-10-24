/* @layer renderer-app @kind component */
import { Button, Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { openExport } from '../../../../export/open-export';
import { addToSheet } from '../../../../sheet-manager/add-to-sheet';
import { atlasExportSettings } from '../../../../sheet-manager/atlas-export-settings';
import { atlasModel } from '../../../../sheet-manager/atlas-model';
import { ATLAS_SIDE_LIMIT } from '../../../../sheet-manager/manager.constants';
import { ATLAS_TEXT } from '../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import { AtlasCanvas } from './sub-components/AtlasCanvas';
import { AtlasControls } from './sub-components/AtlasControls';
import { AtlasPages } from './sub-components/AtlasPages';

const AtlasView = ({ model }: ManagerModelProps) => {
  const settings = useManagerStore((state) => state.atlas);
  const { sheet } = model;
  const { extrude, trim, powerOfTwo, pageSide, page } = settings;
  const atlas = useMemo(
    () => (sheet ? atlasModel({ sheet, sprites: model.artwork.sprites, extrude, trim, powerOfTwo, pageSide, page }) : null),
    [sheet, model.artwork.sprites, extrude, trim, powerOfTwo, pageSide, page],
  );
  if (!sheet || !atlas || (atlas.items.length === 0 && atlas.failure === null)) {
    return (
      <Stack gap="sm">
        <EmptyState message={ATLAS_TEXT.empty} />
        <Button variant="secondary" size="sm" onClick={() => addToSheet(model.order, sheet?.id ?? null)}>
          {ATLAS_TEXT.addAll}
        </Button>
      </Stack>
    );
  }
  return (
    <Stack gap="sm">
      <AtlasControls sheet={sheet} />
      <Text variant="caption" tone="dim">
        {ATLAS_TEXT.size(atlas.width, atlas.height, atlas.empty)}
      </Text>
      <AtlasPages page={atlas.page} count={atlas.pageCount} />
      {atlas.failure !== null && <Callout tone="warning">{atlas.failure}</Callout>}
      {Math.max(atlas.width, atlas.height) > ATLAS_SIDE_LIMIT && <Callout tone="warning">{ATLAS_TEXT.overLimit(ATLAS_SIDE_LIMIT)}</Callout>}
      <AtlasCanvas model={model} atlas={atlas} />
      <Button variant="secondary" size="sm" onClick={() => openExport('sheet', atlasExportSettings(sheet, settings))}>
        {ATLAS_TEXT.export}
      </Button>
    </Stack>
  );
};

export { AtlasView };
