/* @layer renderer-app @kind component */
import { Button, Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { openExport } from '../../../../export/open-export';
import { addToSheet } from '../../../../sheet-manager/add-to-sheet';
import { atlasModel } from '../../../../sheet-manager/atlas-model';
import { ATLAS_SIDE_LIMIT } from '../../../../sheet-manager/manager.constants';
import { ATLAS_TEXT } from '../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import { AtlasCanvas } from './sub-components/AtlasCanvas';
import { AtlasControls } from './sub-components/AtlasControls';

const AtlasView = ({ model }: ManagerModelProps) => {
  const extrude = useManagerStore((state) => state.atlas.extrude);
  const { sheet } = model;
  const atlas = useMemo(() => (sheet ? atlasModel({ sheet, sprites: model.artwork.sprites, extrude }) : null), [sheet, model.artwork.sprites, extrude]);
  if (!sheet || !atlas || atlas.items.length === 0) {
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
      {atlas.failure !== null && <Callout tone="warning">{atlas.failure}</Callout>}
      {Math.max(atlas.width, atlas.height) > ATLAS_SIDE_LIMIT && <Callout tone="warning">{ATLAS_TEXT.overLimit(ATLAS_SIDE_LIMIT)}</Callout>}
      <AtlasCanvas model={model} atlas={atlas} />
      <Button variant="secondary" size="sm" onClick={openExport}>
        {ATLAS_TEXT.export}
      </Button>
    </Stack>
  );
};

export { AtlasView };
