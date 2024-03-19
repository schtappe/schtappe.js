import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "#app/index.js"

test("map", (t) => {
        const result = Utils.generator.map((v) => v * 2, [1, 2, 3])
        assert.equal(result.next().value, 2)
        assert.equal(result.next().value, 4)
        assert.equal(result.next().value, 6)
        assert.equal(result.next().value, null)
})

test("filter", (t) => {
        const result = Utils.generator.filter((v) => v % 2 == 0, [10, 11, 12, 13, 14, 15])
        assert.equal(result.next().value, 10)
        assert.equal(result.next().value, 12)
        assert.equal(result.next().value, 14)
        assert.equal(result.next().value, null)
})

test("reduce", (t) => {
        const result = Utils.generator.reduce((total, item) => total + item, 0, [1, 2, 3])
        assert.equal(result.next().value, 6)
        assert.equal(result.next().value, null)
})

test("compose", (t) => {
        let generator
        let result

        generator = Utils.compose(
                Utils.curry(Utils.generator.map)((v) => v / 2),
                Utils.curry(Utils.generator.map)((v) => v * 3 + 1),
        )
        result = generator([1, 2, 3])
        assert.equal(result.next().value, 2)
        assert.equal(result.next().value, 3.5)
        assert.equal(result.next().value, 5)
        assert.equal(result.next().value, null)

        generator = Utils.compose(
                Utils.curry(Utils.generator.map)((v) => `Hello ${v}`),
                Utils.curry(Utils.generator.filter)((s) => s.startsWith("A"))
        )
        result = generator(["John", "Albert", "Doe", "Adolphine"])
        assert.equal(result.next().value, "Hello Albert")
        assert.equal(result.next().value, "Hello Adolphine")
        assert.equal(result.next().value, null)
})

test("persist", (t) => {
        function* foo() {
                let i = 0
                for (;;) {
                        for (;;) {
                                if (i == 2)
                                        break
                                yield i
                                ++i
                        }
                        ++i
                }
        }
        const baz = Utils.generator.persist(foo())
        assert.deepEqual(baz.next(), { value: 0, done: false })
        assert.deepEqual(baz.next(), { value: 1, done: false })
        assert.deepEqual(baz.next(), { value: 3, done: false })
        assert.deepEqual(baz.next(), { value: 4, done: false })
})
