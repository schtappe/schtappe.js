/**
 * https://nodejs.org/api/assert.html
 */

import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "../index.js"

test("pick", (t) => {
        assert.deepEqual(
                Utils.pick(["foo"], { foo: 1, bar: 2 }),
                { foo: 1 }
        )
        assert.deepEqual(
                Utils.pick(["foo"], { bar: 2 }),
                {}
        )
})

test("empty", (t) => {
        assert.ok(!Utils.empty(Boolean))
        assert.deepEqual(Utils.empty(Date), new Date(0))
        assert.deepEqual(Utils.empty(File), new File([""], "")) // TODO(aes): doesn't fail if content is changed

        const foo = class { }
        assert.equal(Utils.empty(foo), undefined)
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
        assert.deepEqual(
                Utils.compose(
                        (xs) => xs.map((x) => x.toString()),
                        (xs) => xs.filter((x) => x % 2 === 0),
                        (xs) => xs.map((x) => x + 1)
                )([1, 2, 3]),
                ["2", "4"]
        )
})

test("flip/reverse", (t) => {
        assert.equal(Utils.flip(
                (a, b) => a - b,
        )(3, 5),
                2,
        )

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

test("noop/unit", (t) => {
        assert.equal(Utils.noop.toString().replaceAll(" ", ""), "()=>{}")
        assert.equal(Utils.noop(), void 0)
        assert.equal(Utils.unit(), undefined)
})

test("omit", (t) => {
        assert.deepEqual(
                Utils.omit(["foo"], { foo: 1, bar: 2 }),
                { bar: 2 }
        )
})

test("dig", (t) => {
        assert.strictEqual(
                Utils.dig("foo.bar.baz", { foo: { bar: { baz: "qux" } } }),
                "qux"
        )
        assert.strictEqual(
                Utils.dig("foo.bar.baz.qux", {}),
                undefined
        )
})

test("pluralize", (t) => {
        assert.strictEqual(
                Utils.pluralize(-1, "foo", "foos"),
                "foos"
        )
        assert.strictEqual(
                Utils.pluralize(0, "foo", "foos"),
                "foos"
        )
        assert.strictEqual(
                Utils.pluralize(1, "foo", "foos"),
                "foo"
        )
        assert.strictEqual(
                Utils.pluralize(2, "foo", "foos"),
                "foos"
        )
})

test("pipe", (t) => {
        assert.equal(
                Utils.pipe(
                        (x) => x + 1,
                        (x) => x * 2,
                        (x) => x.toString()
                )(3),
                "8"
        )
        assert.deepEqual(
                Utils.pipe(
                        (xs) => xs.map((x) => x + 1),
                        (xs) => xs.filter((x) => x % 2 === 0),
                        (xs) => xs.map((x) => x.toString())
                )([1, 2, 3]),
                ["2", "4"]
        )
})

test("clamp", (t) => {
        assert.deepEqual(
                Utils.clamp(20, 100, 10),
                20
        )
        assert.deepEqual(
                Utils.clamp(20, 100, 50),
                50
        )
        assert.deepEqual(
                Utils.clamp(20, 100, 130),
                100
        )
})

test("functionalize", (t) => {
        assert.equal(
                Utils.functionalize("foo")(),
                "foo"
        )
        assert.equal(
                Utils.functionalize(() => "bar")(),
                "bar"
        )
})

test("identity", (t) => {
        assert.equal(
                Utils.identity("foo"),
                "foo"
        )
})

test("sleep", (t) => {
        assert.doesNotReject(Utils.sleep(1))
})
