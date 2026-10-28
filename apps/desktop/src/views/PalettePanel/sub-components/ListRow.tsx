/* @layer renderer-app @kind component */
import { Box, ColorSwatch, Flex, InlineEdit, TableCell, TableRow, Text } from '@drizztdourden08/tessera';
import { swatchMarks } from '../../../editor/swatch-marks';
import { renameSwatch } from '../../../palette-panel/rename-swatch';
import { renameKey } from '../behavior/rename-key';
import { reportOutcome } from '../behavior/report-outcome';
import { swatchClick } from '../behavior/swatch-click';
import { usageText } from '../behavior/usage-text';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { ListRowProps } from '../PalettePanel.type';
import { CornerMarks } from './CornerMarks';

const ListRow = ({ slot, panel, ramps, active }: ListRowProps) => {
  const { index } = slot;
  const marks = swatchMarks(index, panel.held);
  const use = panel.usage?.slots[index];
  const fixed = slot.transparent || panel.lock.locked;
  return (
    <TableRow className={panel.selection.selected.has(index) ? 'swatch-list__row swatch-list__row--selected' : 'swatch-list__row'} onKeyDown={renameKey}>
      <TableCell className="swatch-list__swatch">
        <Flex align="center" gap="xs">
          <Box className="marked-swatch">
            <ColorSwatch
              size="sm"
              color={slot.hex}
              transparent={slot.transparent}
              data-swatch-index={index}
              tabIndex={active ? 0 : -1}
              aria-label={PALETTE_PANEL_TEXT.name(slot.label, marks, usageText(panel, index))}
              onClick={(event) => swatchClick(panel, index, event, false)}
              onDoubleClick={(event) => panel.editor.open(index, event.currentTarget)}
              onContextMenu={(event) => {
                event.preventDefault();
                swatchClick(panel, index, event, true);
              }}
            />
            <CornerMarks marks={marks} />
          </Box>
          <Text variant="caption" tone="muted">{index}</Text>
        </Flex>
      </TableCell>
      <TableCell className="swatch-list__name">
        {fixed ? <Text variant="caption">{slot.name}</Text> : <InlineEdit size="sm" label={PALETTE_PANEL_TEXT.rename(index)} value={slot.name} onCommit={(name) => reportOutcome(renameSwatch(panel.target, index, name))} />}
      </TableCell>
      <TableCell>
        <Text variant="caption" className="swatch-list__hex">{slot.hex}</Text>
      </TableCell>
      <TableCell align="right">
        <Text variant="caption" tone="muted">{`${Math.round((slot.alpha / 255) * 100)}%`}</Text>
      </TableCell>
      {use && (
        <TableCell align="right">
          <Text variant="caption" tone={use.pixels === 0 ? 'warning' : 'muted'}>{use.pixels}</Text>
        </TableCell>
      )}
      <TableCell>
        <Text variant="caption" tone="muted">{ramps}</Text>
      </TableCell>
    </TableRow>
  );
};

export { ListRow };
