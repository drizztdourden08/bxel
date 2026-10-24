/* @layer renderer-app @kind logic */
import { EXPORT_TEXT } from './export.constants';
import type { ExportKind, PlanParts, PlannedFile, Target } from './export.type';
import { encodeImage } from './encode-image';
import { fileLabel } from './file-label';
import { renderImage } from './render-image';

const imagesOf = (target: Target, kind: ExportKind): Target['frames'] =>
  kind === 'sprite' ? target.frames.slice(0, 1) : target.frames;

const planImages = (parts: PlanParts): PlannedFile[] => {
  const { targets, settings, base, map } = parts;
  const { scale } = settings;
  const files: PlannedFile[] = [];
  for (const [spriteIndex, target] of targets.entries()) {
    const frames = imagesOf(target, settings.kind);
    const width = target.sprite.width * scale;
    const height = target.sprite.height * scale;
    for (const frame of frames) {
      const number = frames.length > 1 ? String(target.sprite.frames.findIndex((each) => each.id === frame.id)) : null;
      const name = `${fileLabel(base, target, targets.length, number)}.png`;
      files.push({
        name,
        detail: EXPORT_TEXT.imageDetail(name, width, height),
        spriteIndex,
        width,
        height,
        make: () => encodeImage(renderImage(target, frame, scale), map),
      });
    }
  }
  return files;
};

export { planImages };
