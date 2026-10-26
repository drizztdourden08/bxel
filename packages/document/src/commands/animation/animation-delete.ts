/* @layer core @kind logic */
import { addReport } from '../../draft/add-report';
import { addWarning } from '../../draft/add-warning';
import { detachTileAnimation } from '../../draft/detach-tile-animation';
import { dropOrphanFrames } from '../../draft/drop-orphan-frames';
import { updateArtwork } from '../../draft/update-artwork';
import { animationDeleteSchema } from '../../schema/animation-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickAnimation } from './pick-animation';

const animationDelete = defineCommand({
  name: COMMAND_NAME.animationDelete,
  scope: 'none',
  schema: animationDeleteSchema,
  run: (draft, input) => {
    const animation = pickAnimation(draft, input.options.animation);
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      animations: artwork.animations.filter((item) => item.id !== animation.id),
    }));
    const tiles = detachTileAnimation(draft, animation.id);
    addReport(draft, 'sprites', dropOrphanFrames(draft));
    if (tiles > 0) {
      addReport(draft, 'tiles', tiles);
      addWarning(draft, 'TILES_DETACHED', `${tiles} tiles played animation "${animation.name}" and now show their still sprite.`);
    }
  },
});

export { animationDelete };
