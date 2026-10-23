/* @layer renderer-app @kind logic */
const readLength = (style: CSSStyleDeclaration, token: string, fallback: number): number => {
  const read = Number.parseFloat(style.getPropertyValue(token));
  return Number.isFinite(read) && read > 0 ? read : fallback;
};

export { readLength };
