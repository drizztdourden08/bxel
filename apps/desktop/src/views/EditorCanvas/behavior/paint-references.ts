/* @layer renderer-app @kind logic */
import { currentReferences } from '../../../reference-image/current-references';
import { pictureCanvas } from '../../../reference-image/picture-canvas';
import { useReferenceStore } from '../../../stores/useReferenceStore';

const paintReferences = (ctx: CanvasRenderingContext2D, above: boolean): void => {
  const { entries } = useReferenceStore.getState();
  for (const reference of currentReferences()) {
    const entry = entries[reference.key];
    if (reference.above !== above || entry?.state !== 'ready') continue;
    const drawable = pictureCanvas(entry.picture);
    if (!drawable) continue;
    const factor = reference.scale / 100;
    ctx.save();
    ctx.globalAlpha = reference.opacity / 100;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(drawable, reference.x, reference.y, entry.picture.width * factor, entry.picture.height * factor);
    ctx.restore();
  }
};

export { paintReferences };
