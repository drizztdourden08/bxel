/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput } from '@drizztdourden08/tessera';
import type { NumberPairProps } from '../ManagerDialogs.type';

const NumberPair = ({ first, second, min, max, step }: NumberPairProps) => (
  <Flex gap="sm" align="center">
    {[first, second].map((each) => (
      <Field key={each.label} label={each.label}>
        <NumberInput size="sm" sizeToContent min={min} max={max} step={step} value={each.value} onChange={each.onChange} />
      </Field>
    ))}
  </Flex>
);

export { NumberPair };
