export const always = (value) => () => (value)

export const capitalize = (value) => {
        value = String(value)
        return value.charAt(0).toLocaleUpperCase() + value.slice(1)
}

export const curry = (fn) => {
        const arity = fn.length
        return function currier(...args) {
                if (args.length < arity) {
                        return currier.bind(null, ...args)
                }
                return fn.apply(null, args)
        }
}

// TODO(aes): assess performance impact
export const compose = (...fns) => (...args) => {
        return fns.reduceRight(
                (result, fn) => [fn.apply(null, result)],
                args
        )[0]
}

const _empty = new Map([
        // primitives
        [ Array, [] ],
        [ Boolean, false ],
        [ Function, () => {} ],
        [ Number, 0 ],
        [ Object, {} ],
        [ String, "" ],
        [ Symbol, Symbol() ],

        // non-primitives
        [ Date, new Date(0) ],
        [ File, new File([""], "") ],
])
export const empty = (type) => {
        if (!_empty.has(type)) throw new Error("Unknown empty type")
        return _empty.get(type)
}

export const functionalize = (maybeFn) =>
        typeof maybeFn == "function"
                ? maybeFn
                : always(maybeFn)

export const identity = (v) => (v)

export const once = (fn) => {
        const result = fn()
        return () => result
}

export const pick = (props = [], object = {}) => {
        return props.reduce((result, prop) => {
                result[prop] = object[prop]
                return result
        }, {})
}

// ((a) => (b) => c) => (b) => (a) => c
export const reverse = (fn) => (a, b) => fn(b)(a)

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const tap = (fn, value) => (fn(value), value)

export * as transformers from "./transformers.js"

export * as predicates from "./predicates.js"

export * as list from "./list.js"
