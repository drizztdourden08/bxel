/* @layer renderer-app @kind types */
import type { Dispatch, SetStateAction } from 'react';
import type { BrowserContextValue } from '../ProjectBrowser.type';

type CrumbDropState = Pick<BrowserContextValue, 'actions' | 'model'>;

type CrumbDropBinding = {
  readonly read: () => CrumbDropState;
  readonly setOverId: Dispatch<SetStateAction<string | null>>;
};

type CrumbDrops = {
  readonly overId: string | null;
  readonly onSegmentRef: (id: string, element: HTMLElement | null) => void;
};

export type { CrumbDropBinding, CrumbDropState, CrumbDrops };
