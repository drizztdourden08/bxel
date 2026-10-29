/* @layer core @kind logic */
const encodeBrushPixels = (pixels: Uint8Array): string => {
  let text = '';
  for (const value of pixels) text += String.fromCharCode(value);
  return btoa(text);
};

const decodeBrushPixels = (text: string): Uint8Array => {
  try {
    return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
  } catch {
    return new Uint8Array(0);
  }
};

export { decodeBrushPixels, encodeBrushPixels };
