/* @layer core @kind logic */
const pair = (value: number): string => value.toString(16).padStart(2, '0');

const formatHexColor = (r: number, g: number, b: number, a: number): string =>
  `#${pair(r)}${pair(g)}${pair(b)}${a === 255 ? '' : pair(a)}`;

export { formatHexColor };
