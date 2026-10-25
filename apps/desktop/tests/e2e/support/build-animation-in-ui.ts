/* @layer renderer-app @kind logic */
import { canvasMapper } from './canvas-mapper';
import { createSprite } from './create-sprite';
import { drawStroke } from './draw-stroke';
import type { Session } from './e2e.type';
import { pickSwatch } from './pick-swatch';
import { UI_ANIMATION } from './ui-animation.constants';

const durationField = (session: Session) =>
  session.page.getByRole('region', { name: 'Timeline' }).getByRole('spinbutton', { name: /^Frame duration/ });

const setDuration = async (session: Session, milliseconds: number): Promise<void> => {
  await durationField(session).fill(String(milliseconds));
  await durationField(session).press('Tab');
};

const buildAnimationInUi = async (session: Session): Promise<void> => {
  const timeline = session.page.getByRole('region', { name: 'Timeline' });
  await createSprite(session);
  const map = await canvasMapper(session, { width: UI_ANIMATION.side, height: UI_ANIMATION.side });
  for (const [at, milliseconds] of UI_ANIMATION.durations.entries()) {
    if (at > 0) await timeline.getByRole('button', { name: 'Add frame' }).click();
    await setDuration(session, milliseconds);
    await pickSwatch(session, UI_ANIMATION.swatches[at] ?? 1);
    await drawStroke(session, map, UI_ANIMATION.strokes[at] ?? []);
  }
  await timeline.getByRole('button', { name: /^Frame 1,/ }).click();
  await timeline.getByRole('button', { name: /^Frame 3,/ }).click({ modifiers: ['Shift'] });
  await timeline.getByRole('button', { name: 'Add tag on the selected frames' }).click();
  const name = timeline.getByRole('textbox', { name: 'Tag name' });
  await name.fill(UI_ANIMATION.tag);
  await name.press('Tab');
};

export { buildAnimationInUi };
