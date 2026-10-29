/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { makeAnimationFrom } from '../../../sheet-manager/make-animation-from';
import { uniqueName } from '../../../sprite-name/unique-name';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';

const SeveralButton = () => {
  const view = useActiveDocument();
  const picked = useSpriteStore((state) => state.selected);
  if (view === null || view.state.readOnly || picked.length <= 1) return null;
  const animations = view.state.artwork.animations;
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        const name = uniqueName(TIMELINE_TEXT.severalName, animations.map((each) => each.name));
        void makeAnimationFrom(picked, name, { name, mode: 'reference', durationMs: 100 });
      }}
    >
      {TIMELINE_TEXT.makeFromSprites(picked.length)}
    </Button>
  );
};

export { SeveralButton };
