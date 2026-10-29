/* @layer renderer-app @kind component */
import { Callout, Checkbox, Flex, Text } from '@drizztdourden08/tessera';
import { ATLAS_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { LayoutPages } from '../../SpritesPanel/sub-components/LayoutSection/sub-components/LayoutPages';
import type { SheetSurfaceProps } from '../SheetCanvas.type';

const SheetExportBar = ({ sheet }: SheetSurfaceProps) => {
  const showExport = useManagerStore((state) => state.showExport);
  const page = useManagerStore((state) => state.atlas.page);
  const patch = useManagerStore((state) => state.patch);
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
      <LayoutPages page={page} count={count} />
      {sheet.failure !== null && <Callout tone="warning">{sheet.failure}</Callout>}
    </Flex>
  );
};

export { SheetExportBar };
