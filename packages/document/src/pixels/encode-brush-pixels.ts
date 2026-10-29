/* @layer core @kind logic */
const encodeBrushPixels = (pixels: Uint8Array): string => {
  let text = '';
  for (const value of pixels) text += String.fromCharCode(value);
  return btoa(text);
};

export { encodeBrushPixels };
