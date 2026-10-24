/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { NoticeState } from './notice-store.type';

const useNoticeStore = create<NoticeState>()((set) => ({
  notice: null,
  post: (text) => set((state) => ({ notice: { id: (state.notice?.id ?? 0) + 1, text } })),
}));

export { useNoticeStore };
