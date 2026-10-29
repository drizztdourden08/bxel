/* @layer renderer-app @kind types */
import type { PointerEvent } from 'react';
import type { TagId } from '@bxel/document';
import type { TagBar } from '../../../timeline/timeline.type';

type Grip = 'move' | 'start' | 'end';

interface TagDraft {
  tagId: TagId | null;
  start: number;
  end: number;
}

interface Hold {
  tagId: TagId | null;
  grip: Grip | 'create';
  index: number;
  start: number;
  end: number;
  moved: boolean;
}

interface TagDrag {
  draft: TagDraft | null;
  grab: (bar: TagBar, event: PointerEvent<HTMLElement>, grip: Grip) => void;
  create: (event: PointerEvent<HTMLElement>) => void;
  move: (event: PointerEvent<HTMLElement>) => void;
  release: (event: PointerEvent<HTMLElement>) => boolean;
}

export type { Hold, TagDrag, TagDraft };
