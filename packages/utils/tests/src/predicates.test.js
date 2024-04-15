import { test } from "node:test"
import assert from "node:assert"

import * as Utils from "#app/index.js"

test("isObject", (t) => {
        assert.ok(!Utils.predicates.isObject(""))
        assert.ok(!Utils.predicates.isObject(0))
        assert.ok(!Utils.predicates.isObject(false))
        assert.ok(!Utils.predicates.isObject(undefined))
        assert.ok(!Utils.predicates.isObject(null))
        assert.ok(!Utils.predicates.isObject(Symbol()))
        assert.ok(!Utils.predicates.isObject(() => { }))
        assert.ok(Utils.predicates.isObject({}))
        assert.ok(Utils.predicates.isObject([]))
        assert.ok(Utils.predicates.isObject(new Date()))
        assert.ok(Utils.predicates.isObject(new Map()))
})

test("isPlainObject", (t) => {
        assert.ok(!Utils.predicates.isPlainObject(""))
        assert.ok(!Utils.predicates.isPlainObject(0))
        assert.ok(!Utils.predicates.isPlainObject(false))
        assert.ok(!Utils.predicates.isPlainObject(undefined))
        assert.ok(!Utils.predicates.isPlainObject(null))
        assert.ok(!Utils.predicates.isPlainObject([]))
        assert.ok(!Utils.predicates.isPlainObject(Symbol()))
        assert.ok(!Utils.predicates.isPlainObject(() => { }))
        assert.ok(!Utils.predicates.isPlainObject(new Date()))
        assert.ok(!Utils.predicates.isPlainObject(new Map()))
        assert.ok(Utils.predicates.isPlainObject({}))
})

test.only("isString", (t) => {
        assert.ok(Utils.predicates.isString(""))
        assert.ok(Utils.predicates.isString("foo"))
        assert.ok(Utils.predicates.isString(String("foo")))
        assert.ok(Utils.predicates.isString(String(123)))
        assert.ok(!Utils.predicates.isString(false))
        assert.ok(!Utils.predicates.isString(456))
        assert.ok(!Utils.predicates.isString(null))
        assert.ok(!Utils.predicates.isString(undefined))
        assert.ok(!Utils.predicates.isString(["foo"]))
        assert.ok(!Utils.predicates.isString({ foo: "bar" }))
        assert.ok(!Utils.predicates.isString(new String("foo")))
        assert.ok(!Utils.predicates.isString(new String(123)))
})
