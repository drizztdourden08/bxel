/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { TilePaint } from '../TilesetPanel.type';
import { commitPaint } from './commit-paint';
import { NO_KEYS } from './useTilePaint.constants';

const useTilePaint = (): TilePaint => {
  const mode = useTilesetViewStore((state) => state.mode);
  const tool = useTilesetViewStore((state) => state.collisionPaint);
  const dataPaint = useTilesetViewStore((state) => state.dataPaint);
  const keys = useRef<Set<number>>(new Set());
  const [painted, setPainted] = useState<ReadonlySet<number>>(NO_KEYS);
  const active = (mode === 'collision' && tool !== 'select') || (mode === 'data' && dataPaint !== null);
  const add = (key: number | null): void => {
    if (key === null || keys.current.has(key)) return;
    keys.current.add(key);
    setPainted(new Set(keys.current));
  };
  const commit = (): void => {
    const done = [...keys.current];
    keys.current = new Set();
    setPainted(NO_KEYS);
    if (done.length > 0) commitPaint(done);
  };
  return { active, painted, add, commit };
};

export { useTilePaint };
