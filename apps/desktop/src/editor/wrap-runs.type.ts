/* @layer renderer-app @kind types */
interface RunWindow {
  start: number;
  length: number;
  room: number;
  wrapped: boolean;
}

interface RunSpan {
  start: number;
  length: number;
}

export type { RunSpan, RunWindow };
