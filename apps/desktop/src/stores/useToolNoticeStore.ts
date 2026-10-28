/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { NOTICE_MS } from './useToolNoticeStore.constants';
import type { ToolNoticeState } from './useToolNoticeStore.type';

let timer: ReturnType<typeof setTimeout> | undefined;

const useToolNoticeStore = create<ToolNoticeState>()((set) => ({
  text: null,
  show: (text) => {
    clearTimeout(timer);
    set({ text });
    timer = setTimeout(() => set({ text: null }), NOTICE_MS);
  },
}));

export { useToolNoticeStore };
