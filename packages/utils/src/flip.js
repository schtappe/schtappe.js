export const flip = (fn) => (a, b, ...args) => fn(b, a, ...args)

// ((a) => (b) => c) => (b) => (a) => c
export const reverse = flip
