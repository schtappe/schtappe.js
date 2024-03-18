// TODO(aes): create a test runner

import * as Utils from "../index.js"

let result

result = Utils.pick(["foo"], { foo: 1, bar: 2})
console.assert(result.foo == 1 && result.bar == undefined)

result = Utils.empty(Boolean)
console.assert(result == false)
result = Utils.empty(Date)
console.assert("getDate" in result)
result = Utils.empty(File)
console.assert("size" in result)

result = Utils.transformers.object.toFormData({ foo: "bar" })
console.assert(result.get("foo") == "bar", "plain object")
result = Utils.transformers.object.toFormData({
        foo: {
                bar: "baz",
                qux: "quux",
                corge: {
                        grault: "garply"
                },
        },
})
console.assert(result.get("foo[bar]") == "baz", "nested object")
console.assert(result.get("foo[qux]") == "quux", "nested object")
console.assert(result.get("foo[corge][grault]") == "garply", "nested object")

console.assert(Utils.predicates.isObject("") == false, "string")
console.assert(Utils.predicates.isObject(0) == false, "number")
console.assert(Utils.predicates.isObject(false) == false, "boolean")
console.assert(Utils.predicates.isObject(undefined) == false, "undefined")
console.assert(Utils.predicates.isObject(null) == false, "null")
console.assert(Utils.predicates.isObject(Symbol()) == false, "symbol")
console.assert(Utils.predicates.isObject(() => {}) == false, "function")
console.assert(Utils.predicates.isObject({}) == true, "object")
console.assert(Utils.predicates.isObject([]) == true, "array")
console.assert(Utils.predicates.isObject(new Date()) == true, "date")
console.assert(Utils.predicates.isObject(new Map()) == true, "map")

console.assert(Utils.predicates.isPlainObject("") == false, "string")
console.assert(Utils.predicates.isPlainObject(0) == false, "number")
console.assert(Utils.predicates.isPlainObject(false) == false, "boolean")
console.assert(Utils.predicates.isPlainObject(undefined) == false, "undefined")
console.assert(Utils.predicates.isPlainObject(null) == false, "null")
console.assert(Utils.predicates.isPlainObject([]) == false, "array")
console.assert(Utils.predicates.isPlainObject(Symbol()) == false, "symbol")
console.assert(Utils.predicates.isPlainObject(() => {}) == false, "function")
console.assert(Utils.predicates.isPlainObject(new Date()) == false, "date")
console.assert(Utils.predicates.isPlainObject(new Map()) == false, "map")
console.assert(Utils.predicates.isPlainObject({}) == true, "object")

console.assert(Utils.tap((value) => value.toFixed(2), 21) == 21)

console.assert(Utils.compose(
        (z) => z.toString(),
        (y) => y + 1,
        (x) => x * 2
)(42) == "85")

console.assert(Utils.reverse(
        (a) => (b) => a - b,
)(1, 2) == 1)

console.assert(Utils.always(123)() == 123)

const memoizedFn = Utils.once(() => Math.random())
const memoizedResult = memoizedFn()
console.assert(memoizedFn() == memoizedResult)
console.assert(memoizedFn() == memoizedResult)

console.assert(Utils.curry((a, b) => a + b)(1)(2) == 3)
console.assert(Utils.curry((a, b) => a + b)(1, 2) == 3)

result = Utils.generator.map((v) => v * 2, [1,2,3])
console.assert(result.next().value == 2)
console.assert(result.next().value == 4)
console.assert(result.next().value == 6)
console.assert(result.next().value == null)

result = Utils.generator.filter((v) => v % 2 == 0, [10,11,12,13,14,15])
console.assert(result.next().value == 10)
console.assert(result.next().value == 12)
console.assert(result.next().value == 14)
console.assert(result.next().value == null)

let generator
generator = Utils.compose(
        Utils.curry(Utils.generator.map)((v) => v / 2),
        Utils.curry(Utils.generator.map)((v) => v * 3 + 1 ),
)
result = generator([1,2,3])
console.assert(result.next().value == 2)
console.assert(result.next().value == 3.5)
console.assert(result.next().value == 5)
console.assert(result.next().value == null)

generator = Utils.compose(
        Utils.curry(Utils.generator.map)((v) => `Hello ${v}`),
        Utils.curry(Utils.generator.filter)((s) => s.startsWith("A"))
)
result = generator(["John", "Albert", "Doe", "Adolphine"])
console.assert(result.next().value == "Hello Albert")
console.assert(result.next().value == "Hello Adolphine")
console.assert(result.next().value == null)

result = Utils.generator.reduce((total, item) => total + item, 0, [1,2,3])
console.assert(result.next().value == 6)
console.assert(result.next().value == null)

console.assert(
        Utils.list.map((x) => x + 1, [1,2,3]).reduce((r, x) => r + x, 0)
                == (2 + 3 + 4)
)

console.assert(
        Utils.list.filter((x) => (x % 2) === 0, [1,2,3]).reduce((r, x) => r + x, 0)
                == (2)
)

console.assert(Utils.list.reduce((r, x) => r + x, 0, [1,2,3]) == (6))

console.assert(
        Utils.list.reduce(
                Utils.reducers.map((x) => x + 1)(Utils.flip(Utils.concat)),
                [],
                [8,7,6]
        ).reduce((r, x) => r + x)
                == (9 + 8 + 7)
)

console.assert(
        Utils.list.reduce(
                Utils.reducers.filter((x) => x % 2 === 0)(Utils.flip(Utils.concat)),
                [],
                [8,7,6]
        ).reduce((r, x) => r + x)
                == (8 + 6)
)

console.log("done!")
