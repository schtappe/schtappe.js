export const map = function* (fn, xs) {
        let index = 0
        for (const x of xs) {
                yield fn(x, index)
                ++index
        }
}

export const filter = function* (fn, xs) {
        let index = 0
        for (const x of xs) {
                if (fn(x, index)) {
                        yield x
                }
                ++index
        }
}

export const reduce = function* (fn, init, xs) {
        let index = 0
        let result = init
        for (const x of xs) {
                result = fn(result, x, index)
                ++index
        }
        yield result
}
