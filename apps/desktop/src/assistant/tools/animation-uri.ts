/* @layer renderer-app @kind logic */
import type { AnimationSource } from './tool-input.type';

const animationUri = (documentId: string, source: AnimationSource, scale: number, revision: number): string => {
  const part = source.frameId !== undefined ? `frame/${source.frameId}` : source.tagId !== undefined ? `tag/${source.tagId}` : 'strip';
  return `bxel://${documentId}/animation/${source.animationId}/${part}/preview.png?scale=${scale}&rev=${revision}`;
};

export { animationUri };
