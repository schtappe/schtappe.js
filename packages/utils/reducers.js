export const map = (fn) =>
        (step) => (r, x) => step(r, fn(x))

export const filter = (fn) =>
        (step) => (r, x) => fn(x) ? step(r, x) : r

// TODO(aes): implement transduce - should convert
// composed list.map and list.filter funtsion to their
// reducers.map and reducers.filter equivalents
//
// /**
//  * (b -> c)    -> (a -> c -> a) -> a    -> [b] -> a
//  * transformer -> reducer       -> seed -> xs  -> a
//  */
// export const transduce = (transformer, reducer, seed, xs) => xs
//         ? xs.reduce(
//                 (r, x) => reducer(r, transformer(x)),
//                 seed,
//         )
//         : (xs) => xs.reduce(
//                 (r, x) => reducer(r, transformer(x)),
//                 seed,
//         )
//
// // ? xs.reduce(
// //         (acc, x) => reducer(acc, transformer(x)),
// //         seed
// // )
// // // NOTE(aes): this function is called a "transducer"
// // // since it "transforms" and subsequently "reduces"
// // : (xs) => xs.reduce(
// //         (acc, x) => reducer(acc, transformer(x)),
// //         seed
// // )
