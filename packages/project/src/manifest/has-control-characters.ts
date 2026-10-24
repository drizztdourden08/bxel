/* @layer core @kind logic */
const hasControlCharacters = (text: string): boolean =>
  Array.from(text).some((character) => {
    const code = character.codePointAt(0) ?? 0;
    return code < 32 || code === 127;
  });

export { hasControlCharacters };
