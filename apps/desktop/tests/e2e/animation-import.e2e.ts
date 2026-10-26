/* @layer renderer-app @kind test */
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Artwork } from '@bxel/document';
import { encodePngRgba } from '@bxel/formats';
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { apngBytes } from './support/apng-bytes';
import { SHORTCUT } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { bytesOf } from './support/bytes-of';
import { gifBytes } from './support/gif-bytes';
import { IMPORTED_ANIMATION } from './support/imported-animation.constants';
import { openAssetTab } from './support/open-asset-tab';
import { openSession } from './support/open-session';
import { readSaved } from './support/read-saved';
import { saveFile } from './support/save-file';
import { useRig } from './support/use-rig';

const { delaysMs, gifFile, apngFile, gifName, apngName } = IMPORTED_ANIMATION;

const importFile = async (session: Session, path: string): Promise<void> => {
  await answerDialogs(session, { open: path, save: null });
  await session.page.keyboard.press(SHORTCUT.importImage);
  const dialog = session.page.getByRole('dialog', { name: /^Import image/ });
  await dialog.getByText(/^Animation with 3 frames/).waitFor();
  await dialog.getByRole('button', { name: 'Next: Colours' }).click();
  await dialog.getByText(/^Extract the best/).click();
  await dialog.getByRole('button', { name: 'Import animation' }).click();
  await dialog.waitFor({ state: 'detached' });
};

const firstIndexes = (artwork: Artwork): (number | undefined)[] => {
  const frames = artwork.animations[0]?.frames ?? [];
  return frames.map((frame) => {
    const sprite = artwork.sprites.find((each) => each.id === frame.spriteId);
    return Object.values(sprite?.cels ?? {})[0]?.pixels[0];
  });
};

describe('a GIF and an APNG import as an animation with frame durations', () => {
  const rig = useRig(async () => {
    const session = await openSession();
    await writeFile(join(session.dir, gifFile), gifBytes(delaysMs.length));
    await writeFile(join(session.dir, apngFile), apngBytes(delaysMs.length));
    return { session };
  });

  test.each([
    ['GIF', gifFile, gifName],
    ['APNG', apngFile, apngName],
  ])('the %s arrives as one animation with a frame for every picture and saves as a .bxanim', async (_, file, name) => {
    const { session } = rig();
    await importFile(session, join(session.dir, file));
    await openAssetTab(session, new RegExp(name)).click();
    const path = join(session.dir, `${name}-saved.bxanim`);
    await saveFile(session, path);
    expect(existsSync(path)).toBe(true);
    const artwork = readSaved(path);
    expect(artwork.animations).toHaveLength(1);
    expect(artwork.sprites.filter((sprite) => sprite.role === 'sprite')).toHaveLength(0);
    expect(artwork.animations[0]?.frames.map((frame) => frame.durationMs)).toEqual(delaysMs);
    expect(new Set(firstIndexes(artwork)).size).toBe(delaysMs.length);
  });
});

const STRIP_CELLS = [
  [224, 36, 94, 255],
  [63, 208, 168, 255],
  [40, 90, 220, 255],
] as const;

const stripPixels = (): Uint8ClampedArray =>
  Uint8ClampedArray.from(Array.from({ length: 12 * 4 }, (_, at) => STRIP_CELLS[Math.floor((at % 12) / 4)] ?? STRIP_CELLS[0]).flat());

describe('a strip imports as an animation with a frame for every cell', () => {
  const rig = useRig(async () => {
    const session = await openSession();
    await writeFile(join(session.dir, 'walk.png'), bytesOf(encodePngRgba({ width: 12, height: 4, data: stripPixels() })));
    return { session };
  });

  test('the cells become frames of one animation saved as a .bxanim', async () => {
    const { session } = rig();
    await answerDialogs(session, { open: join(session.dir, 'walk.png'), save: null });
    await session.page.keyboard.press(SHORTCUT.importImage);
    const dialog = session.page.getByRole('dialog', { name: /^Import image/ });
    await dialog.getByRole('radio', { name: 'Animation' }).check();
    await dialog.getByRole('button', { name: 'Next: Colours' }).click();
    await dialog.getByText(/^Extract the best/).click();
    await dialog.getByRole('button', { name: 'Next: Slicing' }).click();
    await dialog.getByRole('spinbutton', { name: 'Cell size X' }).fill('4');
    await dialog.getByRole('spinbutton', { name: 'Cell size Y' }).fill('4');
    await dialog.getByText('3 frames of 4 by 4 pixels will be made.').waitFor();
    await dialog.getByRole('button', { name: 'Import animation' }).click();
    await dialog.waitFor({ state: 'detached' });
    await openAssetTab(session, /walk/).click();
    const path = join(session.dir, 'strip-saved.bxanim');
    await saveFile(session, path);
    const artwork = readSaved(path);
    expect(artwork.animations[0]?.frames).toHaveLength(3);
    expect(artwork.animations[0]?.width).toBe(4);
    expect(new Set(firstIndexes(artwork)).size).toBe(3);
  });
});
