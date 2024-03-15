// TODO(aes): create a test runner

import * as Utils from "../index.js"

let result

result = Utils.pick(["foo"])({ foo: 1, bar: 2})
console.assert(result.foo == 1 && result.bar == undefined)

result = Utils.empty(Boolean)
console.assert(result == false)
result = Utils.empty(File)
console.assert("size" in result)

console.log("done!")
