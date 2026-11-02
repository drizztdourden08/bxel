/* @layer renderer-app @kind component */
import { PAIR_FIELDS } from './AssetControl.constants';
import type { AssetControlProps } from './AssetControl.type';
import { controlFor } from './behavior/control-for';
import { PairControl } from './sub-components/PairControl';

const AssetControl = ({ field }: AssetControlProps) => {
  const Control = controlFor(field);
  if (Control) return <Control />;
  const pair = PAIR_FIELDS[field];
  return pair ? <PairControl spec={pair} /> : null;
};

export { AssetControl };
