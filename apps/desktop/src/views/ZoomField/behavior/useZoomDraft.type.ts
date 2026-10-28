/* @layer renderer-app @kind types */
import type { ChangeEvent, KeyboardEvent } from 'react';

interface ZoomDraft {
  text: string;
  invalid: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export type { ZoomDraft };
