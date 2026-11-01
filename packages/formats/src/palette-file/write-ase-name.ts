/* @layer core @kind logic */

const writeAseName = (name: string): Uint8Array => {
  const units = name.length + 1;
  const out = new Uint8Array(2 + units * 2);
  const view = new DataView(out.buffer);
  view.setUint16(0, units);
  for (let i = 0; i < name.length; i += 1) view.setUint16(2 + i * 2, name.charCodeAt(i));
  return out;
};

export { writeAseName };
