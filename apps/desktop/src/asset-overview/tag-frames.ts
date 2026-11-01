/* @layer renderer-app @kind logic */
import type { PreviewFrame, PreviewTag } from './asset-overview.type';

const tagFrames = (frames: readonly PreviewFrame[], tag: PreviewTag | undefined): readonly PreviewFrame[] => (tag ? frames.slice(tag.from, tag.to + 1) : frames);

export { tagFrames };
