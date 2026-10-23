/* @layer core @kind logic */
import type { DocumentJson, SpriteJson } from './document-json.type';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';
import { missingReference } from './missing-reference';

const broken = (message: string, path: string): LoadIssue => makeIssue(LOAD_ERROR.REFERENCE_BROKEN, message, path);

const layerIssues = (sprite: SpriteJson, base: string): readonly LoadIssue[] => {
  const frames = new Set<string>(sprite.frames.map((frame) => frame.id));
  const cels = new Set<string>(sprite.celIds);
  return sprite.layers.flatMap((layer, index) =>
    Object.entries(layer.cels).flatMap(([frameId, celId]) => [
      ...missingReference(frames, frameId, 'frame', `${base}.layers[${index}].cels.${frameId}`),
      ...missingReference(cels, celId, 'cel', `${base}.layers[${index}].cels.${frameId}`),
    ]),
  );
};

const tagIssues = (sprite: SpriteJson, base: string): readonly LoadIssue[] => {
  const order = new Map(sprite.frames.map((frame, index) => [frame.id, index]));
  return sprite.tags.flatMap((tag, index) => {
    const from = order.get(tag.from);
    const to = order.get(tag.to);
    const path = `${base}.tags[${index}]`;
    if (from === undefined || to === undefined) return [broken(`Tag ${tag.name} names a frame the sprite does not have.`, path)];
    return from <= to ? [] : [broken(`Tag ${tag.name} runs backwards across the frame list.`, path)];
  });
};

const checkSpriteReferences = (document: DocumentJson): readonly LoadIssue[] => {
  const banks = new Set<string>(document.banks.map((bank) => bank.id));
  return document.sprites.flatMap((sprite, index) => {
    const base = `$.sprites[${index}]`;
    return [
      ...missingReference(banks, sprite.bankId, 'bank', `${base}.bankId`),
      ...layerIssues(sprite, base),
      ...tagIssues(sprite, base),
    ];
  });
};

export { checkSpriteReferences };
