/* @layer renderer-app @kind component */
import { Flex, Span } from '@drizztdourden08/tessera';
import type { PairControlProps } from '../AssetControl.type';
import { PairInput } from './PairInput';

const PairControl = ({ spec }: PairControlProps) => (
  <Flex gap="sm" align="center">
    <PairInput spec={spec} at={0} />
    <Span tone="muted">{spec.joiner}</Span>
    <PairInput spec={spec} at={1} />
    <Span tone="muted">{spec.unit}</Span>
  </Flex>
);

export { PairControl };
