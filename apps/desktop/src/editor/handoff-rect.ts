/* @layer renderer-app @kind logic */
import { unionRect } from '@bxel/document';
import type { ChangeSet } from '@bxel/document';
import type { Rect } from '@bxel/raster';
import type { EditorTarget, PaintSession } from './editor.type';

const handoffRect = (session: PaintSession, target: EditorTarget, changes: ChangeSet): Rect | null => {
  const change = changes.sprites.find((each) => each.id === target.sprite.id);
  if (changes.banks.length > 0 || change?.recolored) return null;
  const rects = (change?.cels ?? []).filter((cel) => cel.frameId === target.frameId).map((cel) => cel.rect);
  const all = session.dirty ? [session.dirty, ...rects] : rects;
  return all.reduce<Rect | null>((union, rect) => (union ? unionRect(union, rect) : rect), null);
};

export { handoffRect };
