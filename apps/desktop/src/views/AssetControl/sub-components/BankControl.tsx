/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { useBankControl } from '../behavior/useBankControl';
import { ASSET_CONTROL_TEXT } from '../AssetControl.constants';

const BankControl = () => {
  const model = useBankControl();
  if (model === null) return null;
  return <Select options={model.options} value={model.value} onChange={model.choose} aria-label={ASSET_CONTROL_TEXT.bankLabel} />;
};

export { BankControl };
