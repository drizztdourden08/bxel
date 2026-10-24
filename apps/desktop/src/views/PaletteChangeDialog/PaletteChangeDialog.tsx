/* @layer renderer-app @kind component */
import { useChangeStore } from '../../stores/useChangeStore';
import { ChangeDialog } from './sub-components/ChangeDialog';
import './PaletteChangeDialog.css';

const PaletteChangeDialog = () => {
  const request = useChangeStore((state) => state.request);
  return request === null ? null : <ChangeDialog request={request} />;
};

export { PaletteChangeDialog };
