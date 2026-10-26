/* @layer core @kind logic */
import { LOAD_ERROR } from '../load-error.constants';
import type { LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';
import type { AnimationFileJson } from './animation-file.type';

const broken = (message: string, path: string): LoadIssue => makeIssue(LOAD_ERROR.REFERENCE_BROKEN, message, path);

const frameIssues = (file: AnimationFileJson, linked: ReadonlySet<string>): readonly LoadIssue[] => {
  const owned = new Set(file.sprites.map((sprite) => sprite.id));
  return file.animation.frames.flatMap((frame, index) => {
    const path = `$.animation.frames[${index}]`;
    if (frame.spriteId === null) return frame.clip === null ? [] : [broken('An empty frame cannot have a clip.', path)];
    return owned.has(frame.spriteId) || linked.has(frame.spriteId)
      ? []
      : [broken(`Frame ${frame.id} names the sprite ${frame.spriteId}, which the file neither holds nor links.`, `${path}.spriteId`)];
  });
};

const tagIssues = (file: AnimationFileJson): readonly LoadIssue[] => {
  const order = new Map(file.animation.frames.map((frame, index) => [frame.id, index] as const));
  const spans = new Set(file.animation.tags.flatMap((tag) => (tag.kind === 'span' ? [tag.id] : [])));
  return file.animation.tags.flatMap((tag, index) => {
    const path = `$.animation.tags[${index}]`;
    if (tag.kind === 'mirror') return spans.has(tag.of) ? [] : [broken('A mirror tag needs a span tag.', `${path}.of`)];
    const from = order.get(tag.from);
    const to = order.get(tag.to);
    return from === undefined || to === undefined || from > to ? [broken(`Tag ${tag.name} needs a span of the frames.`, path)] : [];
  });
};

const duplicateIssues = (file: AnimationFileJson): readonly LoadIssue[] => {
  const ids = [...file.animation.frames.map((frame) => frame.id), ...file.animation.tags.map((tag) => tag.id)];
  return new Set(ids).size === ids.length ? [] : [broken('A frame or tag id is used twice.', '$.animation')];
};

const roleIssues = (file: AnimationFileJson): readonly LoadIssue[] =>
  file.sprites.flatMap((sprite, index) =>
    sprite.role === 'frame' ? [] : [broken(`Sprite ${sprite.id} must be a frame sprite.`, `$.sprites[${index}].role`)],
  );

const animationFileIssues = (file: AnimationFileJson, linked: ReadonlySet<string>): readonly LoadIssue[] => [
  ...(file.animation.frames.length === 0 ? [broken('An animation holds at least one frame.', '$.animation.frames')] : []),
  ...(file.palette.id === file.animation.bankId ? [] : [broken('The animation names another palette than the one it holds.', '$.animation.bankId')]),
  ...roleIssues(file),
  ...frameIssues(file, linked),
  ...tagIssues(file),
  ...duplicateIssues(file),
];

export { animationFileIssues };
