/* @layer renderer-app @kind component */
import type { EntryThumbProps } from '../EntryTile.type';
import { AnimationThumb } from './AnimationThumb';
import { SpriteThumb } from './SpriteThumb';

const EntryThumb = ({ fact, artwork, box, playing }: EntryThumbProps) =>
  fact.kind === 'sprite' ? (
    <SpriteThumb artwork={artwork} sprite={fact.sprite} box={box} />
  ) : (
    <AnimationThumb artwork={artwork} animation={fact.animation} tagId={fact.tagId} box={box} playing={playing} />
  );

export { EntryThumb };
