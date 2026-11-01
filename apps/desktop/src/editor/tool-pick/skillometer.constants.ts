/* @layer renderer-app @kind constants */
const SKILLOMETER_PICKS = 5;

const keyWords = (key: string): string =>
  key
    .split('+')
    .map((part) => (part.length === 1 ? part.toUpperCase() : part))
    .join('+');

const skillometerHint = (label: string, key: string): string => `${label}: press ${keyWords(key)}`;

export { SKILLOMETER_PICKS, skillometerHint };
