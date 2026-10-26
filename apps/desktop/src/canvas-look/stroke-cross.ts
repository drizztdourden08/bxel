/* @layer renderer-app @kind logic */
const strokeCross = (ctx: CanvasRenderingContext2D, x: number, y: number, arm: number): void => {
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.stroke();
};

export { strokeCross };
