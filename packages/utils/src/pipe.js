export const pipe = (...fns) => (...args) => {
        return fns.reduce(
                (result, fn) => [fn.apply(null, result)],
                args
        )[0]
}
