// TODO(aes): assess performance impact and explore alternatives
export const curry = (fn) => {
        const arity = fn.length
        return function currier(...args) {
                if (args.length < arity) {
                        return currier.bind(null, ...args)
                }
                return fn.apply(null, args)
        }
}
