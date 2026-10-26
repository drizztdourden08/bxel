/* @layer renderer-app @kind logic */
import { fillNumber, frameButton, timelineOf } from './animation-ui';
import { canvasMapper } from './canvas-mapper';
import { createAsset } from './create-asset';
import { createSprite } from './create-sprite';
import { drawStroke } from './draw-stroke';
import type { Session } from './e2e.type';
import { pickSwatch } from './pick-swatch';
import { UI_ANIMATION } from './ui-animation.constants';

const buildAnimationInUi = async (session: Session): Promise<void> => {
  const timeline = timelineOf(session);
  await createSprite(session);
  await createAsset(session, 'Animation');
  await frameButton(session, 1).waitFor();
  const map = await canvasMapper(session, { width: UI_ANIMATION.side, height: UI_ANIMATION.side });
  for (const [at, milliseconds] of UI_ANIMATION.durations.entries()) {
    if (at > 0) await timeline.getByRole('button', { name: 'Add frame', exact: true }).click();
    await frameButton(session, at + 1).waitFor();
    await fillNumber(timeline.getByRole('spinbutton', { name: /^Frame duration/ }), milliseconds);
    await pickSwatch(session, UI_ANIMATION.swatches[at] ?? 1);
    await drawStroke(session, map, UI_ANIMATION.strokes[at] ?? []);
  }
  await frameButton(session, 1).click();
  await frameButton(session, 3).click({ modifiers: ['Shift'] });
  await timeline.getByRole('button', { name: 'Add tag on the picked frames' }).click();
  const name = timeline.getByRole('textbox', { name: 'Tag name' });
  await name.fill(UI_ANIMATION.tag);
  await name.press('Tab');
};

export { buildAnimationInUi };
