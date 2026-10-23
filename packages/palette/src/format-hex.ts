/* @layer core @kind logic */

const formatHex = (rgb: number): string => `#${(rgb & 0xffffff).toString(16).padStart(6, '0')}`;

export { formatHex };
