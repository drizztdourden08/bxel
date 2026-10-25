/* @layer renderer-app @kind component */
import { Box, Flex, NumberInput, Span } from '@drizztdourden08/tessera';
import { ASSET_SOURCE } from '../../../asset-config/asset-source.constants';
import { useSourceValue } from '../../../config-source/useSourceValue';
import type { PairControlProps, PairSpec } from '../AssetControl.type';
import './PairControl.css';

const PairInput = ({ spec, at }: { spec: PairSpec; at: 0 | 1 }) => {
  const part = spec.parts[at];
  const value = useSourceValue(ASSET_SOURCE, part.key);
  return (
    <Box className="pair-control__part">
      <NumberInput
        aria-label={part.label}
        value={typeof value === 'number' ? value : spec.min}
        min={spec.min}
        max={spec.max}
        step={spec.step}
        onChange={(next) => void ASSET_SOURCE.set(part.key, next)}
      />
    </Box>
  );
};

const PairControl = ({ spec }: PairControlProps) => (
  <Flex gap="sm" align="center">
    <PairInput spec={spec} at={0} />
    <Span tone="muted">{spec.joiner}</Span>
    <PairInput spec={spec} at={1} />
    <Span tone="muted">{spec.unit}</Span>
  </Flex>
);

export { PairControl };
