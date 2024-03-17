export const map = (fn, xs) => xs
        ? xs.map(fn)
        : (xs) => xs.map(fn)

export const filter = (fn, xs) => xs
        ? xs.filter(fn)
        : (xs) => xs.filter(fn)

export const reduce = (fn, init, xs) => xs.reduce(fn, init)

/**
 * NOTE(aes): while compose is supposed to evaluate from right to left e.g., f(g(h(value)))
 * transduce evaluates from left to right, as it builds up the transducer function
 * i.e., as the stack of input is popped off, there is another stack of transducer being pushed in
 * this MIGHT become apparent if map/filter is implemented via reduce
 * as a hacky-workaround, reduceRight is used here instead
 *
 * https://www.youtube.com/watch?v=6mTbuzafcII
 *
 * (b -> c)    -> (a -> c -> a) -> a    -> [b] -> a
 * transformer -> reducer       -> seed -> xs  -> a
 */
export const transduce = (transformer, reducer, seed, xs) => xs
        ? xs.reduceRight(
                (acc, x) => reducer(acc, transformer(x)),
                seed
        )
        // NOTE(aes): this function is called a "transducer"
        // since it "transforms" and subsequently "reduces"
        : (xs) => xs.reduceRight(
                (acc, x) => reducer(acc, transformer(x)),
                seed
        )
