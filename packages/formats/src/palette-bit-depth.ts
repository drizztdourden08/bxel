/* @layer core @kind logic */
const paletteBitDepth = (entries: number): number => {
  if (entries <= 2) return 1;
  if (entries <= 4) return 2;
  return entries <= 16 ? 4 : 8;
};

export { paletteBitDepth };
