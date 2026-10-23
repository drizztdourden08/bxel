/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Project } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import { frameImage } from './frame-image';

const previewPng = (project: Project): Uint8Array | null => {
  const cover = project.coverSpriteId === null ? undefined : findSprite(project, project.coverSpriteId);
  const sprite = cover ?? project.sprites[0];
  const frame = sprite?.frames[0];
  const bank = sprite ? findBank(project, sprite.bankId) : undefined;
  if (!sprite || !frame || !bank) return null;
  const encoded = encodePngRgba(thumbnailRgba(frameImage(sprite, bank, frame.id)));
  return encoded.ok ? encoded.bytes : null;
};

export { previewPng };
