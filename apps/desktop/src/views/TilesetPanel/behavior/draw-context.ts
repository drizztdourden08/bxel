/* @layer renderer-app @kind logic */
const COLUMNS = 3;

const drawContext = (canvas: HTMLCanvasElement, sources: readonly (HTMLCanvasElement | null)[], size: { width: number; height: number }): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = size.width * COLUMNS;
  canvas.height = size.height * COLUMNS;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sources.forEach((source, at) => {
    if (source) ctx.drawImage(source, (at % COLUMNS) * size.width, Math.floor(at / COLUMNS) * size.height);
  });
};

export { drawContext };
