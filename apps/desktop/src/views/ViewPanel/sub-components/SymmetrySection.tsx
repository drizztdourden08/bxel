/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Text, Toggle } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';
import { SYMMETRY_TEXT } from '../ViewPanel.constants';
import { SYMMETRY_AXES as AXES } from './SymmetrySection.constants';

const SymmetrySection = () => {
  const on = { x: useToolStore((state) => state.symmetryX), y: useToolStore((state) => state.symmetryY) };
  const doubled = { x: useToolStore((state) => state.axisX), y: useToolStore((state) => state.axisY) };
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const diagonal = useDrawingStore((state) => state.symmetryDiagonal);
  const turn = useDrawingStore((state) => state.symmetryTurn);
  const tile = useDrawingStore((state) => state.symmetryTile);
  const toggleMode = useDrawingStore((state) => state.toggleSymmetryMode);
  return (
    <Flex direction="column" gap="xs">
      {AXES.map(({ axis, label }) => (
        <Flex key={axis} gap="sm" align="center" justify="between">
          <Toggle size="sm" label={label} checked={on[axis]} onChange={() => toggle(axis)} />
          <Flex gap="xs" align="center">
            <Text as="span" variant="caption" tone="muted">{doubled[axis] === null ? SYMMETRY_TEXT.centred : SYMMETRY_TEXT.at((doubled[axis] ?? 0) / 2)}</Text>
            <Button
              size="sm"
              variant="ghost"
              disabled={doubled[axis] === null}
              aria-label={SYMMETRY_TEXT.centreLabel(axis.toUpperCase())}
              onClick={() => useToolStore.getState().setAxis(axis, null)}
            >
              {SYMMETRY_TEXT.centre}
            </Button>
          </Flex>
        </Flex>
      ))}
      <Flex gap="sm" align="center">
        <Icon name="pixel-symmetry-diagonal" />
        <Toggle size="sm" label={SYMMETRY_TEXT.diagonal} checked={diagonal} onChange={() => toggleMode('diagonal')} />
      </Flex>
      <Flex gap="sm" align="center">
        <Icon name="pixel-symmetry-turn" />
        <Toggle size="sm" label={SYMMETRY_TEXT.turn} checked={turn} onChange={() => toggleMode('turn')} />
      </Flex>
      <Flex gap="sm" align="center">
        <Icon name="pixel-symmetry-badge" />
        <Toggle size="sm" label={SYMMETRY_TEXT.tile} checked={tile} onChange={() => toggleMode('tile')} />
      </Flex>
    </Flex>
  );
};

export { SymmetrySection };
