export function* map(fn, xs) {
        let index = 0
        for (const x of xs) {
                yield fn(x, index)
                ++index
        }
}

export function* filter(fn, xs) {
        let index = 0
        for (const x of xs) {
                if (fn(x, index)) {
                        yield x
                }
                ++index
        }
}

export const persist = (iterable) => {
        if (iterable[Symbol.iterator]) {
                const iterator = iterable[Symbol.iterator]()
                return {
                        next() { return iterator.next() },
                        [Symbol.iterator]() { return this }
                }
        } else if (iterable[Symbol.asyncIterator]) {
                const iterator = iterable[Symbol.asyncIterator]()
                return {
                        next() { return iterator.next() },
                        [Symbol.asyncIterator]() { return this }
                }
        } else {
                throw new Error("Cannot persist; not an iterable")
        }
}

export function* reduce(fn, init, xs) {
        let index = 0
        let result = init
        for (const x of xs) {
                result = fn(result, x, index)
                ++index
        }
        yield result
}
