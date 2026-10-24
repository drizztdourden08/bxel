/* @layer core @kind logic */
const sheetFrameKey = (spriteName: string, frameIndex: number, frameCount: number): string =>
  frameCount === 1 ? spriteName : `${spriteName}_${frameIndex}`;

export { sheetFrameKey };
