/* @layer renderer-app @kind component */
import { Box, NumberInput } from '@drizztdourden08/tessera';
import { ASSET_SOURCE } from '../../../asset-config/asset-source.constants';
import { useSourceValue } from '../../../config-source/useSourceValue';
import type { PairInputProps } from '../AssetControl.type';
import './PairInput.css';

const PairInput = ({ spec, at }: PairInputProps) => {
  const part = spec.parts[at];
  const value = useSourceValue(ASSET_SOURCE, part.key);
  return (
    <Box className="pair-input">
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

export { PairInput };
