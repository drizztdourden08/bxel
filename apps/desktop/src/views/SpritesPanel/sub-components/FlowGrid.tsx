/* @layer renderer-app @kind component */
import { Box, Flex, MarqueeBox, Stack } from '@drizztdourden08/tessera';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { FolderHeader } from './FolderHeader';
import { GridTile } from './GridTile';

const FlowGrid = (props: SpriteGridProps) => {
  const marquee = useSpriteMarquee(props.model);
  return (
    <Box ref={marquee.area} className="sprites-panel__grid" onPointerDown={marquee.onPointerDown} onClick={marquee.onClick}>
      <Stack gap="xs">
        {props.model.groups
          .filter((group) => !group.hidden)
          .map((group) => (
            <Stack key={group.path} gap="2xs">
              {group.path !== '' && <FolderHeader group={group} />}
              {!group.closed && (
                <Flex wrap gap="xs" role="group" aria-label={group.path === '' ? 'Sprites' : group.path} className="sprites-panel__strip">
                  {group.facts.map((fact) => (
                    <GridTile key={fact.sprite.id} view={props} fact={fact} />
                  ))}
                </Flex>
              )}
            </Stack>
          ))}
      </Stack>
      <MarqueeBox rect={marquee.rect} />
    </Box>
  );
};

export { FlowGrid };
