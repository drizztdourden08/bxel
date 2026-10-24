/* @layer renderer-app @kind types */
interface Notice {
  id: number;
  text: string;
}

interface NoticeState {
  notice: Notice | null;
  post: (text: string) => void;
}

export type { NoticeState };
