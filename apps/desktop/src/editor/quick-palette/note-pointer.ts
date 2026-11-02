/* @layer renderer-app @kind logic */
import { useLastPointerStore } from '../../stores/useLastPointerStore';
import type { QuickPoint } from './quick-palette.type';

const notePointer = (point: QuickPoint): void => useLastPointerStore.setState({ point });

export { notePointer };
