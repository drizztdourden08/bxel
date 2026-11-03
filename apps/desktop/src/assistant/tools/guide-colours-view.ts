/* @layer renderer-app @kind logic */
import { currentGuideColours } from '../../guides/current-guide-colours';

const guideColoursView = () =>
  Object.entries(currentGuideColours()).flatMap(([name, colour]) => {
    const [axis, position] = name.split(':');
    return (axis === 'x' || axis === 'y') && position !== undefined ? [{ axis, position: Number(position), colour }] : [];
  });

export { guideColoursView };
