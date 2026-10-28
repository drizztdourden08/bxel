/* @layer tests @kind logic */

/*
 * MMPX 2x, copied from the JavaScript reference of McGuire and Gagiu (2021), MIT licence
 * (supplement of "MMPX Style-Preserving Pixel Art Magnification", JCGT). It works on packed
 * ABGR colours with a transparent border. The Bxel port must give the same picture on indexes.
 */
const luma = (c: number): number => {
  const alpha = (c & 0xff000000) >>> 24;
  return (((c & 0x00ff0000) >> 16) + ((c & 0x0000ff00) >> 8) + (c & 0x000000ff) + 1) * (256 - alpha);
};
const allEq = (b: number, ...rest: number[]): boolean => rest.every((value) => value === b);
const anyEq = (b: number, ...rest: number[]): boolean => rest.some((value) => value === b);
const noneEq = (b: number, ...rest: number[]): boolean => rest.every((value) => value !== b);

const referenceMmpx = (srcBuffer: Uint32Array, srcWidth: number, srcHeight: number): Uint32Array => {
  const dst = new Uint32Array(srcWidth * srcHeight * 4);
  const src = (x: number, y: number): number =>
    x >= 0 && x < srcWidth && y >= 0 && y < srcHeight ? (srcBuffer[x + y * srcWidth] ?? 0) >>> 0 : 0;
  for (let srcY = 0; srcY < srcHeight; ++srcY) {
    for (let srcX = 0; srcX < srcWidth; ++srcX) {
      const A = src(srcX - 1, srcY - 1), B = src(srcX, srcY - 1), C = src(srcX + 1, srcY - 1);
      const D = src(srcX - 1, srcY), E = src(srcX, srcY), F = src(srcX + 1, srcY);
      const G = src(srcX - 1, srcY + 1), H = src(srcX, srcY + 1), I = src(srcX + 1, srcY + 1);
      const Q = src(srcX - 2, srcY), R = src(srcX + 2, srcY);
      let J = E, K = E, L = E, M = E;
      if (!allEq(E, A, B, C, D, F, G, H, I)) {
        const P = src(srcX, srcY - 2), S = src(srcX, srcY + 2);
        const Bl = luma(B), Dl = luma(D), El = luma(E), Fl = luma(F), Hl = luma(H);
        if (D === B && D !== H && D !== F && (El >= Dl || E === A) && anyEq(E, A, C, G) && (El < Dl || A !== D || E !== P || E !== Q)) J = D;
        if (B === F && B !== D && B !== H && (El >= Bl || E === C) && anyEq(E, A, C, I) && (El < Bl || C !== B || E !== P || E !== R)) K = B;
        if (H === D && H !== F && H !== B && (El >= Hl || E === G) && anyEq(E, A, G, I) && (El < Hl || G !== H || E !== S || E !== Q)) L = H;
        if (F === H && F !== B && F !== D && (El >= Fl || E === I) && anyEq(E, C, G, I) && (El < Fl || I !== H || E !== R || E !== S)) M = F;
        if (E !== F && allEq(E, C, I, D, Q) && allEq(F, B, H) && F !== src(srcX + 3, srcY)) K = M = F;
        if (E !== D && allEq(E, A, G, F, R) && allEq(D, B, H) && D !== src(srcX - 3, srcY)) J = L = D;
        if (E !== H && allEq(E, G, I, B, P) && allEq(H, D, F) && H !== src(srcX, srcY + 3)) L = M = H;
        if (E !== B && allEq(E, A, C, H, S) && allEq(B, D, F) && B !== src(srcX, srcY - 3)) J = K = B;
        if (Bl < El && allEq(E, G, H, I, S) && noneEq(E, A, D, C, F)) J = K = B;
        if (Hl < El && allEq(E, A, B, C, P) && noneEq(E, D, G, I, F)) L = M = H;
        if (Fl < El && allEq(E, A, D, G, Q) && noneEq(E, B, C, I, H)) K = M = F;
        if (Dl < El && allEq(E, C, F, I, R) && noneEq(E, B, A, G, H)) J = L = D;
        if (H !== B) {
          if (H !== A && H !== E && H !== C) {
            if (allEq(H, G, F, R) && noneEq(H, D, src(srcX + 2, srcY - 1))) L = M;
            if (allEq(H, I, D, Q) && noneEq(H, F, src(srcX - 2, srcY - 1))) M = L;
          }
          if (B !== I && B !== G && B !== E) {
            if (allEq(B, A, F, R) && noneEq(B, D, src(srcX + 2, srcY + 1))) J = K;
            if (allEq(B, C, D, Q) && noneEq(B, F, src(srcX - 2, srcY + 1))) K = J;
          }
        }
        if (F !== D) {
          if (D !== I && D !== E && D !== C) {
            if (allEq(D, A, H, S) && noneEq(D, B, src(srcX + 1, srcY + 2))) J = L;
            if (allEq(D, G, B, P) && noneEq(D, H, src(srcX + 1, srcY - 2))) L = J;
          }
          if (F !== E && F !== A && F !== G) {
            if (allEq(F, C, H, S) && noneEq(F, B, src(srcX - 1, srcY + 2))) K = M;
            if (allEq(F, I, B, P) && noneEq(F, H, src(srcX - 1, srcY - 2))) M = K;
          }
        }
      }
      const at = srcX * 2 + srcY * 4 * srcWidth;
      dst[at] = J;
      dst[at + 1] = K;
      dst[at + srcWidth * 2] = L;
      dst[at + srcWidth * 2 + 1] = M;
    }
  }
  return dst;
};

export { luma, referenceMmpx };
