/* @layer renderer-app @kind component */
import { FACING_SETS } from '@bxel/document';
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { useEffect, useMemo, useRef } from 'react';
import { composedImage } from '../../../timeline/composed-image';
import { facingTag } from '../../../timeline/facing-tag';
import { playPlan } from '../../../timeline/play-plan';
import { positionAt } from '../../../timeline/position-at';
import type { FocusProps } from '../TimelinePanel.type';
import { FACING_ABBREVIATION } from '../TimelinePanel.constants';

const FacingPreview = ({ focus }: FocusProps) => {
  const { artwork, animation } = focus;
  const facings = useMemo(() => FACING_SETS[animation.directions].filter((facing) => facingTag(animation, facing) !== undefined), [animation]);
  const canvases = useRef(new Map<string, HTMLCanvasElement>());
  useEffect(() => {
    let frame = 0;
    const plans = facings.flatMap((facing) => {
      const tag = facingTag(animation, facing);
      if (!tag) return [];
      const plan = playPlan({ animation, tagId: tag.id, picked: [], rangePicked: false, loopRange: null, mode: 'loop', subtags: false });
      return plan.steps.length > 0 ? [{ facing, plan }] : [];
    });
    const draw = (now: number): void => {
      for (const { facing, plan } of plans) {
        const canvas = canvases.current.get(facing);
        const step = plan.steps[positionAt(plan, now, 'loop').cursor];
        const image = step ? composedImage(artwork, animation, step.frameId, step.flip) : null;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) continue;
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (image) context.putImageData(image, 0, 0);
      }
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [artwork, animation, facings]);
  return (
    <Box className="facing-preview" role="group" aria-label="Facings playing together">
      {facings.map((facing) => (
        <Box key={facing} className="facing-preview__cell">
          <Canvas
            ref={(node: HTMLCanvasElement | null) => {
              if (node) canvases.current.set(facing, node);
              else canvases.current.delete(facing);
            }}
            className="facing-preview__canvas"
            width={animation.width}
            height={animation.height}
            aria-hidden="true"
          />
          <Text as="span" variant="caption" tone="muted">{FACING_ABBREVIATION[facing]}</Text>
        </Box>
      ))}
    </Box>
  );
};

export { FacingPreview };
