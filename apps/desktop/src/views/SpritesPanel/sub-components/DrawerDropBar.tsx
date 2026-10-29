/* @layer renderer-app @kind component */
import { useSheetDragging } from '../behavior/useSheetDragging';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { DrawerDropTarget } from './DrawerDropTarget';

const DrawerDropBar = ({ model }: ManagerModelProps) => (useSheetDragging() ? <DrawerDropTarget model={model} /> : null);

export { DrawerDropBar };
