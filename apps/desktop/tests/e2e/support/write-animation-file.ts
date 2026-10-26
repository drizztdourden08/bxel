/* @layer renderer-app @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sliceAsset } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { encodeAnimation } from '@bxel/document/native';

const writeAnimationFile = async (dir: string, name: string, artwork: Artwork): Promise<string> => {
  const animation = artwork.animations[0];
  if (!animation) throw new Error('the animation was not made');
  const path = join(dir, `${name}.bxanim`);
  await writeFile(path, encodeAnimation(sliceAsset(artwork, { kind: 'animation', id: animation.id }, new Map()), null, () => 0));
  return path;
};

export { writeAnimationFile };
