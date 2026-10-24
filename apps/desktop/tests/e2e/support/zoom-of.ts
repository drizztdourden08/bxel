/* @layer renderer-app @kind logic */
import { STATUS_LABEL, ZOOM_PATTERN } from './e2e.constants';
import type { Session } from './e2e.type';

const zoomOf = async (session: Session): Promise<number> => {
  const text = await session.page.getByRole('region', { name: STATUS_LABEL }).innerText();
  const percent = Number(ZOOM_PATTERN.exec(text)?.[1]);
  if (!Number.isFinite(percent)) throw new Error(`the status shows no zoom: ${text}`);
  return percent / 100;
};

export { zoomOf };
