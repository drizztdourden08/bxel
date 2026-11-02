/* @layer renderer-app @kind types */
interface TileClockState {
  paused: boolean;
  speed: number;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
}

export type { TileClockState };
