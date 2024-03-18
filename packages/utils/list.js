import { concat } from "./concat.js"
import * as reducers from "./reducers.js"

export const map = (fn, xs) => xs
        ? xs.map(fn)
        : (xs) => xs.map(fn)

export const filter = (fn, xs) => xs
        ? xs.filter(fn)
        : (xs) => xs.filter(fn)

export const reduce = (fn, seed, xs) => xs
        ? xs.reduce(fn, seed)
        : (xs) => xs.reduce(fn, seed)
