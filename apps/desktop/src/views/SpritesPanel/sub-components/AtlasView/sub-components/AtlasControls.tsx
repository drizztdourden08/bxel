/* @layer renderer-app @kind component */
import { Checkbox, Field, Flex, SegmentedControl, Slider, Stack } from '@drizztdourden08/tessera';
import { ATLAS_LIMITS } from '../../../../../sheet-manager/manager.constants';
import { ATLAS_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { styleSheet } from '../../../../../sheet-manager/style-sheet';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import { ATLAS_LAYOUTS } from '../AtlasView.constants';
import type { AtlasControlsProps } from '../AtlasView.type';
import { StyleNumber } from './StyleNumber';

const AtlasControls = ({ sheet }: AtlasControlsProps) => {
  const atlas = useManagerStore((state) => state.atlas);
  const patchAtlas = useManagerStore((state) => state.patchAtlas);
  const { layout } = sheet;
  return (
    <Stack gap="sm">
      <Field label={ATLAS_TEXT.layout}>
        <SegmentedControl
          size="sm"
          aria-label={ATLAS_TEXT.layout}
          value={layout.kind}
          options={[...ATLAS_LAYOUTS]}
          onChange={(kind) => styleSheet(sheet.id, { layout: kind })}
        />
      </Field>
      <Flex gap="sm" wrap>
        {layout.kind === 'grid' && (
          <StyleNumber label={ATLAS_TEXT.columns} value={layout.columns} min={1} max={ATLAS_LIMITS.columnsMax} onCommit={(columns) => styleSheet(sheet.id, { columns })} />
        )}
        {layout.kind === 'packed' && (
          <StyleNumber label={ATLAS_TEXT.maxWidth} value={layout.maxWidth} min={1} max={ATLAS_LIMITS.widthMax} onCommit={(maxWidth) => styleSheet(sheet.id, { maxWidth })} />
        )}
        <StyleNumber label={ATLAS_TEXT.spacing} value={sheet.spacing.x} min={0} max={ATLAS_LIMITS.spacingMax} onCommit={(spacing) => styleSheet(sheet.id, { spacing })} />
        <StyleNumber label={ATLAS_TEXT.margin} value={sheet.margin} min={0} max={ATLAS_LIMITS.marginMax} onCommit={(margin) => styleSheet(sheet.id, { margin })} />
        <StyleNumber label={ATLAS_TEXT.extrude} value={atlas.extrude} min={0} max={ATLAS_LIMITS.extrudeMax} onCommit={(extrude) => patchAtlas({ extrude })} />
      </Flex>
      <Flex gap="md" align="center" wrap>
        <Slider size="sm" aria-label={ATLAS_TEXT.zoom} min={1} max={ATLAS_LIMITS.zoomMax} step={1} value={atlas.zoom} onChange={(zoom) => patchAtlas({ zoom })} />
        <Checkbox label={ATLAS_TEXT.pivots} checked={atlas.pivots} onChange={(pivots) => patchAtlas({ pivots })} />
        <Checkbox label={ATLAS_TEXT.bounds} checked={atlas.bounds} onChange={(bounds) => patchAtlas({ bounds })} />
      </Flex>
    </Stack>
  );
};

export { AtlasControls };
