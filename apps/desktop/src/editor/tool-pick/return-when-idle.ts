/* @layer renderer-app @kind logic */
import { useLivePaintStore } from '../../stores/useLivePaintStore';
import { useToolStore } from '../../stores/useToolStore';
import type { ToolId } from '../tool.type';
import { useSpringStore } from './behavior/useSpringStore';
import { springPending } from './spring-pending';
import { strokeActive } from './stroke-active';

const returnWhenIdle = (back: ToolId): void => {
  springPending.stop?.();
  const finish = (): void => {
    springPending.stop?.();
    springPending.stop = null;
    useSpringStore.getState().borrow(null, null);
    useToolStore.getState().setTool(back);
  };
  springPending.stop = useLivePaintStore.subscribe(() => {
    if (!strokeActive()) finish();
  });
};

export { returnWhenIdle };
