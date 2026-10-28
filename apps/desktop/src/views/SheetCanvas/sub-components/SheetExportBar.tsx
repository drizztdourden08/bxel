/* @layer renderer-app @kind component */
import { Callout, Checkbox, Flex, Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { ATLAS_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { SheetSurfaceProps } from '../SheetCanvas.type';

/** The toggle that swaps the sheet canvas for the export result, with the page buttons of a sheet that packs to several pages. */
const SheetExportBar = ({ sheet }: SheetSurfaceProps) => {
  const showExport = useManagerStore((state) => state.showExport);
  const page = useManagerStore((state) => state.atlas.page);
  const patch = useManagerStore((state) => state.patch);
  const patchAtlas = useManagerStore((state) => state.patchAtlas);
  const count = sheet.exported?.pageCount ?? 1;
  if (!sheet.model.sheet) return null;
  return (
    <Flex gap="sm" align="center" wrap className="sheet-canvas__bar">
      <Checkbox label={ATLAS_TEXT.showExport} checked={showExport} onChange={(next) => patch({ showExport: next })} />
      {sheet.exported && (
        <Text variant="caption" tone="dim" aria-live="polite">
          {`${sheet.exported.width} by ${sheet.exported.height}`}
        </Text>
      )}
      {count > 1 && (
        <Flex gap="xs" align="center">
          <IconButton label={ATLAS_TEXT.previous} size="sm" disabled={page === 0} onClick={() => patchAtlas({ page: page - 1 })}>
            <Icon name="arrow-left" size={16} />
          </IconButton>
          <Text variant="caption">{ATLAS_TEXT.page(page + 1, count)}</Text>
          <IconButton label={ATLAS_TEXT.next} size="sm" disabled={page >= count - 1} onClick={() => patchAtlas({ page: page + 1 })}>
            <Icon name="arrow-right" size={16} />
          </IconButton>
        </Flex>
      )}
      {sheet.failure !== null && <Callout tone="warning">{sheet.failure}</Callout>}
    </Flex>
  );
};

export { SheetExportBar };
