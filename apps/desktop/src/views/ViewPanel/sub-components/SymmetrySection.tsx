/* @layer renderer-app @kind component */
import { Button, Flex, Text, Toggle } from '@drizztdourden08/tessera';
import { useToolStore } from '../../../stores/useToolStore';
import { SYMMETRY_TEXT } from '../ViewPanel.constants';
import { SYMMETRY_AXES as AXES } from './SymmetrySection.constants';

const SymmetrySection = () => {
  const on = { x: useToolStore((state) => state.symmetryX), y: useToolStore((state) => state.symmetryY) };
  const doubled = { x: useToolStore((state) => state.axisX), y: useToolStore((state) => state.axisY) };
  const toggle = useToolStore((state) => state.toggleSymmetry);
  return (
    <Flex direction="column" gap="xs">
      {AXES.map(({ axis, label }) => (
        <Flex key={axis} gap="sm" align="center" justify="between">
          <Toggle size="sm" label={label} checked={on[axis]} onChange={() => toggle(axis)} />
          <Flex gap="xs" align="center">
            <Text as="span" variant="caption" tone="muted">{doubled[axis] === null ? SYMMETRY_TEXT.centred : SYMMETRY_TEXT.at((doubled[axis] ?? 0) / 2)}</Text>
            <Button
              size="xs"
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
    </Flex>
  );
};

export { SymmetrySection };
