/* @layer core @kind config */
const FLAG_BIT = { flipX: 1, flipY: 2, diagonal: 4 } as const;

const ALL_FLAG_BITS = FLAG_BIT.flipX | FLAG_BIT.flipY | FLAG_BIT.diagonal;

export { ALL_FLAG_BITS, FLAG_BIT };
