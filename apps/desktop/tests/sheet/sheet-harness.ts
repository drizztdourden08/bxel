/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, Sprite, SpriteId } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { currentArtwork } from '../../src/sheet/current-artwork';
import { runDocument } from '../../src/sheet/run-document';
import { SPRITE_DEFAULTS } from '../../src/stores/sprite-store.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useToolStore } from '../../src/stores/useToolStore';

const openFile = (names: readonly string[], size = 8): void => {
  useNoticeStore.setState({ notice: null });
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
  useSpriteStore.setState({ ...SPRITE_DEFAULTS });
  usePendingStore.getState().clear();
  const steps = names.map((name) => ({ name: COMMAND_NAME.spriteCreate, targets: null, options: { name, width: size, height: size } }));
  if (steps.length > 0 && runDocument('Add sprites', steps) === null) throw new Error('could not add sprites');
};

const artwork = (): Artwork => {
  const found = currentArtwork();
  if (!found) throw new Error('no document');
  return found;
};

const spriteOf = (name: string): Sprite => {
  const found = artwork().sprites.find((sprite) => sprite.name === name);
  if (!found) throw new Error(`no sprite ${name}`);
  return found;
};

const idOf = (name: string): SpriteId => spriteOf(name).id;

const namesOf = (): string[] => artwork().sprites.map((sprite) => sprite.name);

const pixelsOf = (name: string): number[] => {
  const sprite = spriteOf(name);
  const cel = Object.values(sprite.cels)[0];
  return cel ? Array.from(cel.pixels) : [];
};

const lastNotice = (): string | null => useNoticeStore.getState().notice?.text ?? null;

export { artwork, idOf, lastNotice, namesOf, openFile, pixelsOf, spriteOf };
