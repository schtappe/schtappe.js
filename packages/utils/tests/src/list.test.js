import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "#app/index.js"

test("map", (t) => {
        assert.equal(
                Utils.list.map((x) => x + 1, [1, 2, 3]).reduce((r, x) => r + x, 0),
                (2 + 3 + 4)
        )
})

test("filter", (t) => {
        assert.equal(
                Utils.list.filter((x) => (x % 2) === 0, [1, 2, 3]).reduce((r, x) => r + x, 0),
                (2)
        )
})

test("reduce", (t) => {
        assert.equal(
                Utils.list.reduce((r, x) => r + x, 0, [1, 2, 3]),
                (6)
        )
})
