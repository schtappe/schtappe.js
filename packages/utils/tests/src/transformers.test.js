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
                        alpha: [
                                { beta: "gamma" },
                                { delta: "epsilon" },
                                { zeta: { eta: "theta", iota: [{ kappa: "lambda" }] } }
                        ],
                },
        })
        assert.deepEqual(
                Array.from(result.entries()),
                [
                        ["foo[bar]", "baz"],
                        ["foo[qux]", "quux"],
                        ["foo[corge][grault]", "garply"],
                        ["foo[alpha][0][beta]", "gamma"],
                        ["foo[alpha][1][delta]", "epsilon"],
                        ["foo[alpha][2][zeta][eta]", "theta"],
                        ["foo[alpha][2][zeta][iota][0][kappa]", "lambda"],
                ],
        )
})
