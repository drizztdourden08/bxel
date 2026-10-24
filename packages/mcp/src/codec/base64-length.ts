/* @layer core @kind logic */
const base64Length = (byteLength: number): number => Math.ceil(byteLength / 3) * 4;

export { base64Length };
