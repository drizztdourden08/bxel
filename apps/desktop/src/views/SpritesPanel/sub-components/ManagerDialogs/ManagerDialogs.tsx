/* @layer renderer-app @kind component */
import { useManagerStore } from '../../../../stores/useManagerStore';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import { PivotDialog } from './sub-components/PivotDialog';
import { RenameDialog } from './sub-components/RenameDialog';
import { ResizeDialog } from './sub-components/ResizeDialog';

const ManagerDialogs = ({ model }: ManagerModelProps) => {
  const dialog = useManagerStore((state) => state.dialog);
  if (dialog === 'rename') return <RenameDialog model={model} />;
  if (dialog === 'pivot') return <PivotDialog model={model} />;
  if (dialog === 'resize') return <ResizeDialog model={model} />;
  return null;
};

export { ManagerDialogs };
