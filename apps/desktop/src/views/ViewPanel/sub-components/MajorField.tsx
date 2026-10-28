/* @layer renderer-app @kind component */
import { Flex, NumberInput, Text } from '@drizztdourden08/tessera';
import { MAJOR_RANGE } from '../../../asset-view/asset-view.constants';
import { useAssetView } from '../../../asset-view/useAssetView';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { clampRange } from '../behavior/clamp-range';
import { OVERLAY_TEXT } from '../ViewPanel.constants';

const MajorField = () => {
  const { view, patch } = useAssetView();
  const look = useCanvasLook();
  return (
    <Flex gap="xs" align="center">
      <Text as="span" variant="caption" tone="muted" className="view-panel__field-label">{OVERLAY_TEXT.majorEvery}</Text>
      <NumberInput
        size="sm"
        aria-label={OVERLAY_TEXT.majorEvery}
        min={MAJOR_RANGE.min}
        max={MAJOR_RANGE.max}
        value={view.majorEvery ?? look.majorLine.every}
        onChange={(value) => patch({ majorEvery: clampRange(value, MAJOR_RANGE) })}
      />
      <Text as="span" variant="caption" tone="muted">{OVERLAY_TEXT.pixels}</Text>
    </Flex>
  );
};

export { MajorField };
