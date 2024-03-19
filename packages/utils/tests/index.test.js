import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "../index.js"

test("pick", (t) => {
        assert.deepEqual(
                Utils.pick(["foo"], { foo: 1, bar: 2 }),
                { foo: 1 }
        )
})

test("empty", (t) => {
        assert.ok(!Utils.empty(Boolean))
        assert.deepEqual(Utils.empty(Date), new Date(0))
        assert.deepEqual(Utils.empty(File), new File([""], "")) // TODO(aes): doesn't fail if content is changed
})

test("tap", (t) => {
        assert.equal(
                Utils.tap((value) => value.toFixed(2), 21),
                "21.00"
        )
})

test("compose", (t) => {
        assert.equal(Utils.compose(
                (z) => z.toString(),
                (y) => y + 1,
                (x) => x * 2
        )(42),
                "85"
        )
})

test("reverse", (t) => {
        assert.equal(Utils.reverse(
                (a, b) => a - b,
        )(3, 5),
                2,
        )
})

test("always", (t) => {
        assert.equal(Utils.always(123)(), 123)
})

test("once", (t) => {
        const memoizedFn = Utils.once(() => Math.random())
        const memoizedResult = memoizedFn()
        assert.equal(memoizedFn(), memoizedResult)
        assert.equal(memoizedFn(), memoizedResult)
})

test("curry", (t) => {
        assert.equal(Utils.curry((a, b) => a + b)(1)(2), 3)
        assert.equal(Utils.curry((a, b) => a + b)(1, 2), 3)
})
