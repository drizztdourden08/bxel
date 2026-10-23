/* @layer core @kind logic */
const remapCel = (pixels: Uint8Array, table: Uint8Array): Uint8Array => pixels.map((value) => table[value] ?? 0);

export { remapCel };
