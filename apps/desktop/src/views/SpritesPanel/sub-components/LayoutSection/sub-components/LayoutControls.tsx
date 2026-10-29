/* @layer renderer-app @kind component */
import { Field, Flex, SegmentedControl, Stack } from '@drizztdourden08/tessera';
import { ATLAS_LIMITS } from '../../../../../sheet-manager/manager.constants';
import { ATLAS_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { styleSheet } from '../../../../../sheet-manager/style-sheet';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import { ATLAS_LAYOUTS } from '../LayoutSection.constants';
import type { LayoutControlsProps } from '../LayoutSection.type';
import { LayoutPackControls } from './LayoutPackControls';
import { StyleNumber } from './StyleNumber';

const LayoutControls = ({ sheet }: LayoutControlsProps) => {
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
          <>
            <StyleNumber label={ATLAS_TEXT.columns} value={layout.columns} min={1} max={ATLAS_LIMITS.columnsMax} onCommit={(columns) => styleSheet(sheet.id, { columns })} />
            <StyleNumber label={ATLAS_TEXT.cellWidth} value={layout.cellWidth} min={1} max={ATLAS_LIMITS.cellMax} onCommit={(cellWidth) => styleSheet(sheet.id, { cellWidth })} />
            <StyleNumber label={ATLAS_TEXT.cellHeight} value={layout.cellHeight} min={1} max={ATLAS_LIMITS.cellMax} onCommit={(cellHeight) => styleSheet(sheet.id, { cellHeight })} />
          </>
        )}
        {layout.kind === 'packed' && (
          <StyleNumber label={ATLAS_TEXT.maxWidth} value={layout.maxWidth} min={1} max={ATLAS_LIMITS.widthMax} onCommit={(maxWidth) => styleSheet(sheet.id, { maxWidth })} />
        )}
        <StyleNumber label={ATLAS_TEXT.spacing} value={sheet.spacing.x} min={0} max={ATLAS_LIMITS.spacingMax} onCommit={(spacing) => styleSheet(sheet.id, { spacing })} />
        <StyleNumber label={ATLAS_TEXT.margin} value={sheet.margin} min={0} max={ATLAS_LIMITS.marginMax} onCommit={(margin) => styleSheet(sheet.id, { margin })} />
        <StyleNumber label={ATLAS_TEXT.extrude} value={atlas.extrude} min={0} max={ATLAS_LIMITS.extrudeMax} onCommit={(extrude) => patchAtlas({ extrude })} />
      </Flex>
      <LayoutPackControls sheet={sheet} />
    </Stack>
  );
};

export { LayoutControls };
