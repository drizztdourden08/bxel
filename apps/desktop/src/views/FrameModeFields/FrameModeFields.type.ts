/* @layer renderer-app @kind types */
import type { FrameMode } from '../../add-frames/add-frames.type';

interface FrameModeFieldsProps {
  mode: FrameMode | null;
  durationMs: number;
  onMode: (mode: FrameMode) => void;
  onDuration: (durationMs: number) => void;
}

export type { FrameModeFieldsProps };
