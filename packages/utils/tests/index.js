import * as Utils from "../index.js"

let result = Utils.pick(["foo"])({ foo: 1, bar: 2})
console.assert(result.foo == 1 && result.bar == undefined)
