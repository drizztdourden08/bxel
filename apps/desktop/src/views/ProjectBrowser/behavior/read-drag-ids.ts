/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';
import { ASSET_DRAG_TYPE } from '../ProjectBrowser.constants';

const idOf = (each: unknown): string[] => (typeof each === 'object' && each !== null && 'id' in each && typeof each.id === 'string' ? [each.id] : []);

const readDragIds = (event: DragEvent): readonly string[] => {
  try {
    const parsed: unknown = JSON.parse(event.dataTransfer.getData(ASSET_DRAG_TYPE));
    return Array.isArray(parsed) ? parsed.flatMap(idOf) : [];
  } catch {
    return [];
  }
};

export { readDragIds };
