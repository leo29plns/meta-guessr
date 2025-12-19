/**
 *
 * @param  {...number} n
 * @returns
 */
export const sum = (...n) => n.reduce((acc, val) => acc + val, 0);
