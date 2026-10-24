/* @layer renderer-app @kind logic */
import { readFileSync } from 'node:fs';
import type { Artwork } from '@bxel/document';
import { decodeArtwork } from '@bxel/document/native';

const readSaved = (path: string): Artwork => {
  const report = decodeArtwork(readFileSync(path));
  if (report.outcome !== 'ok' || !report.artwork) throw new Error(`the file did not load clean: ${report.issues.map((issue) => issue.message).join(' ')}`);
  return report.artwork;
};

export { readSaved };
