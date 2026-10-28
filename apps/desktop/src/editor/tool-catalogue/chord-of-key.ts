/* @layer renderer-app @kind logic */
const chordOfKey = (key: string): string => (key.length === 1 ? key.toUpperCase() : key);

export { chordOfKey };
