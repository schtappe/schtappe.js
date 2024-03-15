// TODO(aes): create a test runner

import * as Utils from "../index.js"

let result

result = Utils.pick(["foo"])({ foo: 1, bar: 2})
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
console.assert(Utils.predicates.isObject([]) == false, "array")
console.assert(Utils.predicates.isObject(Symbol()) == false, "symbol")
console.assert(Utils.predicates.isObject(() => {}) == false, "function")
console.assert(Utils.predicates.isObject({}) == true, "object")
console.assert(Utils.predicates.isObject(new Date()) == true, "date")
console.assert(Utils.predicates.isObject(new Map()) == true, "map")

console.assert(Utils.tap((value) => value.toFixed(2))(21) == 21)

console.assert(Utils.compose(
        (z) => z.toString(),
        (y) => y + 1,
        (x) => x * 2
)(42) == "85")

console.log("done!")
