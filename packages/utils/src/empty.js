const types = new Map([
        // primitives
        [Array, []],
        [Boolean, false],
        [Function, () => { }],
        [Number, 0],
        [Object, {}],
        [String, ""],
        [Symbol, Symbol()],

        // non-primitives
        [Date, new Date(0)],
        [File, new File([""], "")],
])

export const empty = (type) => types.get(type)
