export const capitalize = (value) => {
        value = String(value)
        return value.charAt(0).toLocaleUpperCase() + value.slice(1)
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
        [ File, new File([""], "") ],
])
export const empty = (type) => {
        if (!_empty.has(type)) throw new Error("Unknown empty type")
        return _empty.get(type)
}

export const functionalize = (maybeFn) =>
        typeof maybeFn == "function"
                ? maybeFn
                : () => maybeFn

export const identity = (v) => (v)

export const pick = (props = []) => (object = {}) => {
        return props.reduce((result, prop) => {
                result[prop] = object[prop]
                return result
        }, {})
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
