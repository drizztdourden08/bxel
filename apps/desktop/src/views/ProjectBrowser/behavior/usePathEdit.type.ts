/* @layer renderer-app @kind types */
import type { ChangeEvent, KeyboardEvent } from 'react';

type PathEdit = {
  readonly typed: string;
  readonly invalid: boolean;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly onKeyDown: (event: KeyboardEvent) => void;
};

export type { PathEdit };
