/* @layer core @kind logic */
const decodeBrushPixels = (text: string): Uint8Array => {
  try {
    return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
  } catch {
    return new Uint8Array(0);
  }
};

export { decodeBrushPixels };
