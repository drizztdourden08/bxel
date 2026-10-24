/* @layer renderer-app @kind component */
import { Span } from '@drizztdourden08/tessera';
import type { SizePairProps } from '../TilemapDialog.type';
import { SizeField } from './SizeField';

const SizePair = ({ range, first, second }: SizePairProps) => (
  <>
    <SizeField range={range} field={first} />
    <Span>x</Span>
    <SizeField range={range} field={second} />
  </>
);

export { SizePair };
