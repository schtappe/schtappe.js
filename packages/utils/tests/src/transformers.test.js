import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "#app/index.js"

test("toFormData", (t) => {
        assert.ok(Utils.transformers.object.toFormData({}) instanceof FormData)

        let result

        result = Utils.transformers.object.toFormData({ foo: "bar" })
        assert.deepEqual(
                Array.from(result.entries()),
                [["foo", "bar"]],
        )

        result = Utils.transformers.object.toFormData({
                foo: {
                        bar: "baz",
                        qux: "quux",
                        corge: {
                                grault: "garply"
                        },
                },
        })
        assert.deepEqual(
                Array.from(result.entries()),
                [
                        ["foo[bar]", "baz"],
                        ["foo[qux]", "quux"],
                        ["foo[corge][grault]", "garply"],
                ],
        )
})
