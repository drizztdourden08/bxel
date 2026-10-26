/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { scopeItems } from './scope-items';
import { useScopeModel } from './useScopeModel';

const useScopeItems = (): ToolbarItem[] => scopeItems(useScopeModel());

export { useScopeItems };
