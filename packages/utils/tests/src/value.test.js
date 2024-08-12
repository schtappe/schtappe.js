import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "#app/index.js"
const TYPE = Utils.value.TYPE

const formData = new FormData()
formData.append("input", "value")
const map = new Map()
map.set("key", "value")
const set = new Set()
set.add("entry1")
const values = [
        ["foo", "bar", "baz"],
        42n,
        true,
        formData,
        () => { console.log("foo") },
        map,
        null,
        69,
        { foo: "bar" },
        set,
        "foobar",
        Symbol("foo"),
        undefined,
]

test("toRaw", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toRaw()
                assert.deepEqual(result, value)
        }
})

test("toOriginal", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toOriginal()
                assert.deepEqual(result, { success: true, value })
        }
})

test("toArray", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toArray()
                switch (thing.type) {
                        case TYPE.ARRAY: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        case TYPE.MAP: {
                                assert.deepEqual(result, { success: true, value: [["key", "value"]] })
                                break
                        }
                        case TYPE.OBJECT: {
                                assert.deepEqual(result, { success: true, value: [["foo", "bar"]] })
                                break
                        }
                        case TYPE.SET: {
                                assert.deepEqual(result, { success: true, value: ["entry1"] })
                                break
                        }
                        case TYPE.FORMDATA: {
                                assert.deepEqual(result, { success: true, value: [["input", "value"]] })
                                break
                        }
                        default:
                                assert.deepEqual(result, { success: true, value: [value] })
                }
        }
})

test("toBigint", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toBigint()
                switch (thing.type) {
                        case TYPE.BIGINT: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        case TYPE.BOOLEAN: {
                                assert.deepEqual(result, { success: true, value: 1 })
                                break
                        }
                        case TYPE.NUMBER: {
                                assert.deepEqual(result, { success: true, value: 69 })
                                break
                        }
                        default:
                                assert.ok(!result.success)
                }
        }
})

test("toBoolean", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toBoolean()
                switch (thing.type) {
                        case TYPE.NULL:
                        case TYPE.UNDEFINED: {
                                assert.deepEqual(result, { success: true, value: false })
                                break
                        }
                        default:
                                assert.deepEqual(result, { success: true, value: true })
                }
        }
})

test("toFormdata", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toFormdata()
                switch (thing.type) {
                        case TYPE.ARRAY: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [["0", "foo"], ["1", "bar"], ["2", "baz"]])
                                break
                        }
                        case TYPE.FORMDATA: {
                                assert.deepEqual(Array.from(result.value), [["input", "value"]])
                                break
                        }
                        case TYPE.MAP: {
                                assert.deepEqual(Array.from(result.value), [["key", "value"]])
                                break
                        }
                        case TYPE.OBJECT: {
                                assert.deepEqual(Array.from(result.value), [["foo", "bar"]])
                                break
                        }
                        case TYPE.SET: {
                                assert.deepEqual(Array.from(result.value), [["0", "entry1"]])
                                break
                        }
                        default:
                                assert.ok(!result.success)
                }
        }

        const thing = Utils.value.create({
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
        const result = thing.toFormdata()
        assert.ok(result.success)
        assert.deepEqual(
                [...result.value.entries()],
                [
                        ["foo[bar]", "baz"],
                        ["foo[qux]", "quux"],
                        ["foo[corge][grault]", "garply"],
                        ["foo[alpha][0][beta]", "gamma"],
                        ["foo[alpha][1][delta]", "epsilon"],
                        ["foo[alpha][2][zeta][eta]", "theta"],
                        ["foo[alpha][2][zeta][iota][0][kappa]", "lambda"],
                ]
        )
})

test("toFunction", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toFunction()
                switch (thing.type) {
                        case TYPE.FUNCTION: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        default:
                                assert.ok(result.success)
                                assert.deepEqual(result.value(), value)
                                break
                }
        }
})

test("toMap", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toMap()
                switch (thing.type) {
                        case TYPE.ARRAY: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [[0, "foo"], [1, "bar"], [2, "baz"]])
                                break
                        }
                        case TYPE.FORMDATA: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [["input", "value"]])
                                break
                        }
                        case TYPE.MAP: {
                                assert.ok(result.success)
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        case TYPE.OBJECT: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [["foo", "bar"]])
                                break
                        }
                        case TYPE.SET: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [["entry1", "entry1"]])
                                break
                        }
                        default:
                                assert.ok(!result.success)
                                break
                }
        }
})

test("toNull", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toNull()
                assert.deepEqual(result, { success: true, value: null })
        }
})

test("toNumber", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toNumber()
                switch (thing.type) {
                        case TYPE.BIGINT: {
                                assert.deepEqual(result, { success: true, value: BigInt(value) })
                                break
                        }
                        case TYPE.BOOLEAN: {
                                assert.deepEqual(result, { success: true, value: 1 })
                                break
                        }
                        case TYPE.NUMBER: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        default:
                                assert.ok(!result.success)
                                break
                }
        }
})

test("toObject", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toObject()
                switch (thing.type) {
                        case TYPE.ARRAY: {
                                assert.deepEqual(result, { success: true, value: { 0: "foo", 1: "bar", 2: "baz" } })
                                break
                        }
                        case TYPE.FORMDATA: {
                                assert.deepEqual(result, { success: true, value: { "input": "value" } })
                                break
                        }
                        case TYPE.MAP: {
                                assert.deepEqual(result, { success: true, value: { "key": "value" } })
                                break
                        }
                        case TYPE.OBJECT: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        case TYPE.SET: {
                                assert.deepEqual(result, { success: true, value: { "entry1": "entry1" } })
                                break
                        }
                        default:
                                assert.ok(!result.success)
                                break
                }
        }
})

test("toSet", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toSet()
                switch (thing.type) {
                        case TYPE.ARRAY: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), ["foo", "bar", "baz"])
                                break
                        }
                        case TYPE.FORMDATA: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [["input", "value"]])
                                break
                        }
                        case TYPE.MAP: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [["key", "value"]])
                                break
                        }
                        case TYPE.OBJECT: {
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), ["bar"])
                                break
                        }
                        case TYPE.SET: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        default:
                                assert.ok(result.success)
                                assert.deepEqual(Array.from(result.value), [value])
                                break
                }
        }
})

test("toString", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toString()
                switch (thing.type) {
                        case TYPE.ARRAY: {
                                assert.deepEqual(result, { success: true, value: "foo,bar,baz" })
                                break
                        }
                        case TYPE.BIGINT: {
                                assert.deepEqual(result, { success: true, value: "42" })
                                break
                        }
                        case TYPE.BOOLEAN: {
                                assert.deepEqual(result, { success: true, value: "true" })
                                break
                        }
                        case TYPE.FORMDATA: {
                                assert.deepEqual(result, { success: true, value: "input=value" })
                                break
                        }
                        case TYPE.FUNCTION: {
                                assert.deepEqual(result, { success: true, value: '() => { console.log("foo") }' })
                                break
                        }
                        case TYPE.MAP: {
                                assert.deepEqual(result, { success: true, value: '{"key":"value"}' })
                                break
                        }
                        case TYPE.NULL: {
                                assert.deepEqual(result, { success: true, value: "null" })
                                break
                        }
                        case TYPE.NUMBER: {
                                assert.deepEqual(result, { success: true, value: "69" })
                                break
                        }
                        case TYPE.OBJECT: {
                                assert.deepEqual(result, { success: true, value: '{"foo":"bar"}' })
                                break
                        }
                        case TYPE.SET: {
                                assert.deepEqual(result, { success: true, value: "entry1" })
                                break
                        }
                        case TYPE.STRING: {
                                assert.deepEqual(result, { success: true, value: "foobar" })
                                break
                        }
                        case TYPE.SYMBOL: {
                                assert.deepEqual(result, { success: true, value: "foo" })
                                break
                        }
                        case TYPE.UNDEFINED: {
                                assert.deepEqual(result, { success: true, value: "undefined" })
                                break
                        }
                        default:
                                assert.ok(false, result)
                }
        }
})

test("toSymbol", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toSymbol()
                switch (thing.type) {
                        case TYPE.SYMBOL: {
                                assert.deepEqual(result, { success: true, value })
                                break
                        }
                        case TYPE.STRING: {
                                assert.ok(result.success)
                                assert.deepEqual(result.value.description, "foobar")
                                break
                        }
                        default:
                                assert.ok(!result.success)
                                break
                }
        }
})

test("toUndefined", (t) => {
        for (const value of values) {
                const thing = Utils.value.create(value)
                const result = thing.toUndefined()
                assert.deepEqual(result, { success: true, value: undefined })
        }
})
