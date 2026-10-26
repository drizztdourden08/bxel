/* @layer renderer-app @kind logic */
import type { AnimationSource } from './tool-input.type';

const partOf = (source: AnimationSource): string => {
  if (source.frameId !== undefined) return `frame/${source.frameId}`;
  return source.tagId === undefined ? 'strip' : `tag/${source.tagId}`;
};

const animationUri = (documentId: string, source: AnimationSource, scale: number, revision: number): string =>
  `bxel://${documentId}/animation/${source.animationId}/${partOf(source)}/preview.png?scale=${scale}&rev=${revision}`;

export { animationUri };
