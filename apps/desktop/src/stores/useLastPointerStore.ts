/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { LastPointerState } from './last-pointer-store.type';

const useLastPointerStore = create<LastPointerState>()(() => ({ point: null }));

export { useLastPointerStore };
