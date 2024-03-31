export const compose = (...fns) => (...args) => {
        return fns.reduceRight(
                (result, fn) => [fn.apply(null, result)],
                args
        )[0]
}
