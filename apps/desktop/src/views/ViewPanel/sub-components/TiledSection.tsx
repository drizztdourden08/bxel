/* @layer renderer-app @kind component */
import { Flex, SegmentedControl, Text } from '@drizztdourden08/tessera';
import { TILED_HINTS } from '../../CanvasToolbar/CanvasToolbar.constants';
import { useViewStore } from '../../../stores/useViewStore';
import { TILED_ORDER, TILED_TEXT } from '../ViewPanel.constants';
import { TiledGlyph } from './TiledGlyph';

const TiledSection = () => {
  const tiled = useViewStore((state) => state.tiled);
  const setTiled = useViewStore((state) => state.setTiled);
  return (
    <Flex direction="column" gap="xs">
      <SegmentedControl
        size="sm"
        label={TILED_TEXT.mode}
        value={tiled}
        options={TILED_ORDER.map((mode) => ({
          value: mode,
          title: TILED_HINTS[mode].description,
          label: (
            <Flex as="span" direction="column" align="center" gap="2xs">
              <TiledGlyph mode={mode} />
              <Text as="span" variant="caption">{TILED_HINTS[mode].name}</Text>
            </Flex>
          ),
        }))}
        onChange={setTiled}
      />
      <Text variant="caption" tone="muted">{TILED_TEXT.hint}</Text>
    </Flex>
  );
};

export { TiledSection };
