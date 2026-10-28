/* @layer renderer-app @kind logic */
const drawThumb = (canvas: HTMLCanvasElement, source: HTMLCanvasElement | null, zoom: number): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx || !source) return;
  canvas.width = source.width * zoom;
  canvas.height = source.height * zoom;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
};

export { drawThumb };
