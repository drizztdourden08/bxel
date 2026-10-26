/* @layer renderer-app @kind types */
import type { KeyboardEvent, MouseEvent } from 'react';

type MenuHookEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export type { MenuHookEvent };
