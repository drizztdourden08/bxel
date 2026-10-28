/* @layer renderer-app @kind hook */
import type { BxelContext } from './bxel-context.type';
import { useContextStore } from './useContextStore';

const useBxelContext = <T>(select: (context: BxelContext) => T): T => useContextStore((state) => select(state.context));

export { useBxelContext };
