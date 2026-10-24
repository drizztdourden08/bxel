/* @layer renderer-app @kind component */
import { Box, EmptyState, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { FOCUS_ZONE } from '../../editor/focus/focus-zone.constants';
import { useSpriteScene } from '../../hooks/useSpriteScene';
import { pickSpriteById } from '../../sheet/pick-sprite-by-id';
import { renameSprite } from '../../sheet/rename-sprite';
import { spriteImage } from '../../sheet/sprite-image';
import { usePendingStore } from '../../stores/usePendingStore';
import { NO_SPRITES, SPRITES_TEXT } from './SpritesPanel.constants';
import { useSpriteDrag } from './behavior/useSpriteDrag';
import { useSpriteRename } from './behavior/useSpriteRename';
import { useSpritesKeys } from './behavior/useSpritesKeys';
import { SpriteRename } from './sub-components/SpriteRename';
import { SpriteTile } from './sub-components/SpriteTile';
import { SpritesToolbar } from './sub-components/SpritesToolbar';
import './SpritesPanel.css';

const SpritesPanel = () => {
  const model = useSpriteScene();
  const rename = useSpriteRename();
  const affected = usePendingStore((state) => state.pending?.sprites ?? NO_SPRITES);
  const onKeyDown = useSpritesKeys(model?.scene ?? null, rename.begin);
  const dragFor = useSpriteDrag(model);
  if (!model) return <EmptyState message={SPRITES_TEXT.empty} />;
  const { scene, artwork } = model;
  const renaming = scene.sprites.find((sprite) => sprite.id === rename.renamingId);
  return (
    <Stack gap="sm">
      <Text variant="label">{SPRITES_TEXT.title(scene.sprites.length, scene.selected.length)}</Text>
      <SpritesToolbar scene={scene} />
      <Box onKeyDown={onKeyDown} data-focus-zone={FOCUS_ZONE.sprites}>
        <Flex wrap gap="xs" role="group" aria-label={SPRITES_TEXT.list} className="sprites-panel__strip">
          {scene.sprites.map((sprite) => (
            <SpriteTile
              key={sprite.id}
              sprite={sprite}
              image={spriteImage(artwork, sprite)}
              selected={scene.selected.some((each) => each.id === sprite.id)}
              active={scene.active?.id === sprite.id}
              affected={affected.includes(sprite.id)}
              drag={dragFor(sprite.id)}
              onPick={(how) => pickSpriteById(sprite.id, how)}
              onRename={() => rename.begin(sprite.id)}
            />
          ))}
        </Flex>
      </Box>
      {renaming && (
        <SpriteRename
          key={renaming.id}
          spriteName={renaming.name}
          onCancel={rename.finish}
          onCommit={(name) => {
            if (renameSprite(renaming.id, name)) rename.finish();
          }}
        />
      )}
    </Stack>
  );
};

export { SpritesPanel };
