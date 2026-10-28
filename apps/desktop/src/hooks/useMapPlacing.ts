/* @layer renderer-app @kind hook */
import { useBxelContext } from '../ui-context/useBxelContext';

const useMapPlacing = (): boolean => useBxelContext((context) => context.surface === 'map');

export { useMapPlacing };
