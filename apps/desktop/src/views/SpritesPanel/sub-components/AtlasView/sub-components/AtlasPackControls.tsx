/* @layer renderer-app @kind component */
import { Checkbox, Flex, Text } from '@drizztdourden08/tessera';
import { ATLAS_LIMITS } from '../../../../../sheet-manager/manager.constants';
import { ATLAS_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { AtlasControlsProps } from '../AtlasView.type';
import { StyleNumber } from './StyleNumber';

const AtlasPackControls = ({ sheet }: AtlasControlsProps) => {
  const atlas = useManagerStore((state) => state.atlas);
  const patchAtlas = useManagerStore((state) => state.patchAtlas);
  const manual = sheet.layout.kind === 'manual';
  const packed = sheet.layout.kind === 'packed';
  return (
    <Flex gap="md" align="center" wrap>
      <Checkbox label={ATLAS_TEXT.trim} disabled={manual} checked={atlas.trim && !manual} onChange={(trim) => patchAtlas({ trim, page: 0 })} />
      <Checkbox label={ATLAS_TEXT.powerOfTwo} checked={atlas.powerOfTwo} onChange={(powerOfTwo) => patchAtlas({ powerOfTwo, page: 0 })} />
      <Checkbox label={ATLAS_TEXT.rotate} disabled={!packed} checked={atlas.rotate && packed} onChange={(rotate) => patchAtlas({ rotate, page: 0 })} />
      {manual && (
        <Text variant="caption" tone="dim">
          {ATLAS_TEXT.trimManual}
        </Text>
      )}
      {!packed && !manual && (
        <Text variant="caption" tone="dim">
          {ATLAS_TEXT.rotateNeedsPacked}
        </Text>
      )}
      <StyleNumber
        label={ATLAS_TEXT.pageSide}
        value={atlas.pageSide}
        min={0}
        max={ATLAS_LIMITS.pageMax}
        onCommit={(pageSide) => patchAtlas({ pageSide, page: 0 })}
      />
    </Flex>
  );
};

export { AtlasPackControls };
