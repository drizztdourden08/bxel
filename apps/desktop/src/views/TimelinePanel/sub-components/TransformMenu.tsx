/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { useDirectionSetStore } from '../../../stores/useDirectionSetStore';
import { exportFrames } from '../../../timeline/export-frames';
import { makeSpritesheet } from '../../../timeline/make-spritesheet';
import { splitToSprites } from '../../../timeline/split-to-sprites';
import { TRANSFORM_TEXT } from '../TimelinePanel.constants';
import type { MenuProps } from '../TimelinePanel.type';

const TransformMenu = ({ disabled }: MenuProps) => {
  const showDirections = useDirectionSetStore((state) => state.show);
  const items = [
    { id: 'directions', label: TRANSFORM_TEXT.directions, disabled, onSelect: showDirections },
    { id: 'spritesheet', label: TRANSFORM_TEXT.spritesheet, onSelect: () => void makeSpritesheet() },
    { id: 'split', label: TRANSFORM_TEXT.split, disabled, onSelect: () => void splitToSprites() },
    { id: 'frames', label: TRANSFORM_TEXT.frames, onSelect: exportFrames },
  ];
  return <DropdownMenu size="sm" label={TRANSFORM_TEXT.menu} trigger={{ label: TRANSFORM_TEXT.menu }} groups={[{ id: 'transform', items }]} />;
};

export { TransformMenu };
