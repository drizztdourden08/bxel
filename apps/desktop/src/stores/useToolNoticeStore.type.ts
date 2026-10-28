/* @layer renderer-app @kind types */
interface ToolNoticeState {
  text: string | null;
  show: (text: string) => void;
}

export type { ToolNoticeState };
