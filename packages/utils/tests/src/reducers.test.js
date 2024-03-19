import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "#app/index.js"

test("map", (t) => {
        assert.equal(
                Utils.list.reduce(
                        Utils.reducers.map((x) => x + 1)(Utils.flip(Utils.concat)),
                        [],
                        [8, 7, 6]
                ).reduce((r, x) => r + x),
                (9 + 8 + 7)
        )
})

test("filter", (t) => {
        assert.equal(
                Utils.list.reduce(
                        Utils.reducers.filter((x) => x % 2 === 0)(Utils.flip(Utils.concat)),
                        [],
                        [8, 7, 6]
                ).reduce((r, x) => r + x),
                (8 + 6)
        )
})
