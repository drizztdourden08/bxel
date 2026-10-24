/* @layer renderer-app @kind component */
import { useManagerStore } from '../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import { DIALOG_VIEWS } from './dialog-views.constants';

const ManagerDialogs = ({ model }: ManagerModelProps) => {
  const dialog = useManagerStore((state) => state.dialog);
  if (dialog === null) return null;
  const View = DIALOG_VIEWS[dialog];
  return <View model={model} />;
};

export { ManagerDialogs };
