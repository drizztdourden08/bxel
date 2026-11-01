/* @layer renderer-app @kind test */
const artworkOptions = (name: string) => ({
  name,
  bank: {
    name: 'Bank',
    cap: 8,
    transparent: true,
    colors: [
      { rgb: '#140b26', name: 'Night' },
      { rgb: '#7b3fe4', name: 'Violet' },
    ],
  },
  sprite: { name: 'hero', width: 4, height: 4 },
});

export { artworkOptions };
