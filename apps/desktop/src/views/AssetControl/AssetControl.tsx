/* @layer renderer-app @kind component */
import { PAIR_FIELDS } from './AssetControl.constants';
import { CONTROLS } from './asset-controls.constants';
import type { AssetControlProps } from './AssetControl.type';
import { PairControl } from './sub-components/PairControl';

const AssetControl = ({ field }: AssetControlProps) => {
  const Control = Object.hasOwn(CONTROLS, field) ? CONTROLS[field] : undefined;
  if (Control) return <Control />;
  const pair = PAIR_FIELDS[field];
  return pair ? <PairControl spec={pair} /> : null;
};

export { AssetControl };
