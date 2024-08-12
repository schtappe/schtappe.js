import { isPlainObject } from "./predicates.js"

export const TYPE = Object.freeze({
        ARRAY: { name: "array" },
        BIGINT: { name: "bigint" },
        BOOLEAN: { name: "boolean" },
        FORMDATA: { name: "formdata" },
        FUNCTION: { name: "function" },
        MAP: { name: "map" },
        NULL: { name: "null" },
        NUMBER: { name: "number" },
        OBJECT: { name: "object" },
        SET: { name: "set" },
        STRING: { name: "string" },
        SYMBOL: { name: "symbol" },
        UNDEFINED: { name: "undefined" },
        UNKNOWN: { name: "unknown" },
})

const instanceTypes = [
        [FormData, TYPE.FORMDATA],
        [Map, TYPE.MAP],
        [Set, TYPE.SET],
]
const getType = (data) => {
        switch (typeof (data)) {
                case "bigint":
                        return TYPE.BIGINT
                case "boolean":
                        return TYPE.BOOLEAN
                case "function":
                        return TYPE.FUNCTION
                case "number":
                        return TYPE.NUMBER
                case "string":
                        return TYPE.STRING
                case "symbol":
                        return TYPE.SYMBOL
                case "undefined":
                        return TYPE.UNDEFINED
                default: // "object"
        }

        if (data == null)
                return TYPE.NULL
        else if (Array.isArray(data))
                return TYPE.ARRAY

        for (const [object, type] of instanceTypes) {
                if (data instanceof object)
                        return type
        }

        if (isPlainObject(data)) {
                return TYPE.OBJECT
        }

        return TYPE.UNKNOWN
}

const success = (data) => ({ success: true, value: data })
const failure = () => ({ success: false })

export const create = (data) => {
        const cache = new Map()
        const save = (key, value) => {
                cache.set(key, value)
                return value
        }
        const type = getType(data)
        const value = {
                type,
                toRaw() {
                        return data
                },
                toOriginal() {
                        if (cache.has(type)) return cache.get(type)
                        return save(type, success(data))
                },
                toArray() {
                        const toType = TYPE.ARRAY
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.ARRAY:
                                        return value.toOriginal()
                                case TYPE.FORMDATA:
                                case TYPE.SET:
                                case TYPE.MAP:
                                        return save(toType, success(Array.from(data)))
                                case TYPE.OBJECT:
                                        return save(toType, success(Object.entries(data)))
                                default:
                                        return save(toType, success([data]))
                        }
                },
                toBigint() {
                        const toType = TYPE.BIGINT
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.BIGINT:
                                        return value.toOriginal()
                                case TYPE.BOOLEAN:
                                        return save(toType, success(data ? 1n : 0n))
                                case TYPE.NUMBER:
                                        return save(toType, success(BigInt(data)))
                                default:
                                        return save(toType, failure())
                        }
                },
                toBoolean() {
                        const toType = TYPE.BOOLEAN
                        if (cache.has(toType)) return cache.get(toType)
                        return save(toType, success(!!data))
                },
                toFormdata() {
                        const toType = TYPE.FORMDATA
                        if (cache.has(toType)) return cache.get(toType)

                        const flatten = (queue) => {
                                const result = [] // [["key", "value"]]
                                while (queue.length) {
                                        const { v, ks } = queue.shift() // { value, keys: [key] }
                                        const type = getType(v)
                                        switch (type) {
                                                case TYPE.ARRAY:
                                                        queue.push(...v.map((v, k) => ({ v, ks: [...ks, k] })))
                                                        break
                                                case TYPE.FORMDATA:
                                                case TYPE.MAP:
                                                        queue.push(...Array.from(v, ([k, v]) => ({ v, ks: [...ks, k] })))
                                                        break
                                                case TYPE.OBJECT:
                                                        queue.push(...Object.entries(v).map(([k, v]) => ({ v, ks: [...ks, k] })))
                                                        break
                                                case TYPE.SET:
                                                        queue.push(...Array.from(v, (v, k) => ({ v, ks: [...ks, k] })))
                                                        break
                                                default:
                                                        result.push([
                                                                ks.reduce((xs, x, i) => i == 0 ? x : `${xs}[${x}]`, ""),
                                                                v,
                                                        ])
                                        }
                                }
                                const formData = result.reduce((formData, [key, value]) => {
                                        formData.append(key, value)
                                        return formData
                                }, new FormData())
                                return formData
                        }

                        let formData
                        switch (type) {
                                case TYPE.ARRAY: {
                                        formData = data.reduce((formData, entry, i) => {
                                                formData.append(i, entry)
                                                return formData
                                        }, new FormData())
                                        break
                                }
                                case TYPE.FORMDATA:
                                        return value.toOriginal()
                                case TYPE.MAP: {
                                        const queue = Array.from(data, ([k, v]) => ({ v, ks: [k] }))
                                        formData = flatten(queue)
                                        break
                                }
                                case TYPE.SET: {
                                        const queue = Array.from(data, (v, k) => ({ v, ks: [k] }))
                                        formData = flatten(queue)
                                        break
                                }
                                case TYPE.OBJECT: {
                                        const queue = Object.entries(data).map(([k, v]) => ({ v, ks: [k] }))
                                        formData = flatten(queue)
                                        break
                                }
                                default:
                                        return save(toType, failure())
                        }

                        return save(toType, success(formData))
                },
                toFunction() {
                        const toType = TYPE.FUNCTION
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.FUNCTION:
                                        return value.toOriginal()
                                default:
                                        return save(toType, success(() => data))
                        }
                },
                toMap() {
                        const toType = TYPE.MAP
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.ARRAY:
                                case TYPE.FORMDATA:
                                        return save(toType, success(new Map(data.entries())))
                                case TYPE.MAP:
                                        return value.toOriginal()
                                case TYPE.OBJECT:
                                        return save(toType, success(new Map(Object.entries(data))))
                                case TYPE.SET:
                                        return save(toType, success(new Map(data.entries())))
                                default:
                                        return save(toType, failure())
                        }
                },
                toNull() {
                        const toType = TYPE.NULL
                        if (cache.has(toType)) return cache.get(toType)
                        return save(toType, success(null))
                },
                toNumber() {
                        const toType = TYPE.NUMBER
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.BIGINT:
                                        return save(toType, success(Number(data)))
                                case TYPE.BOOLEAN:
                                        return save(toType, success(data ? 1 : 0))
                                case TYPE.NUMBER:
                                        return value.toOriginal()
                                default:
                                        return save(toType, failure())
                        }
                },
                toObject() {
                        const toType = TYPE.OBJECT
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.ARRAY:
                                case TYPE.FORMDATA:
                                case TYPE.MAP:
                                case TYPE.SET:
                                        return save(toType, success(Object.fromEntries(data.entries())))
                                case TYPE.OBJECT:
                                        return value.toOriginal()
                                default:
                                        return save(toType, failure())
                        }
                },
                toSet() {
                        const toType = TYPE.SET
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.ARRAY:
                                case TYPE.FORMDATA:
                                case TYPE.MAP:
                                        return save(toType, success(new Set(data)))
                                case TYPE.OBJECT:
                                        return save(toType, success(new Set(Object.values(data))))
                                case TYPE.SET:
                                        return value.toOriginal()
                                default:
                                        return save(toType, success(new Set([data])))
                        }
                },
                toString() {
                        const toType = TYPE.STRING
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.FORMDATA: {
                                        let result = [...data.entries()]
                                        result = result.reduce((string, [key, value], i) => {
                                                if (i == 0) {
                                                        return `${key}=${value}`
                                                }
                                                return `${string}&${key}=${value}`
                                        }, "")
                                        return save(toType, success(result))
                                }
                                case TYPE.MAP: {
                                        let result = Object.fromEntries(data.entries())
                                        result = JSON.stringify(result)
                                        return save(toType, success(result))
                                }
                                case TYPE.OBJECT: {
                                        const result = JSON.stringify(data)
                                        return save(toType, success(result))
                                }
                                case TYPE.SET:
                                        return save(toType, success(String(Array.from(data))))
                                case TYPE.STRING:
                                        return value.toOriginal()
                                case TYPE.SYMBOL:
                                        return save(toType, success(data.description))
                                default:
                                        return save(toType, success(String(data)))
                        }
                },
                toSymbol() {
                        const toType = TYPE.SYMBOL
                        if (cache.has(toType)) return cache.get(toType)

                        switch (type) {
                                case TYPE.STRING:
                                        return save(toType, success(Symbol(data)))
                                case TYPE.SYMBOL:
                                        return value.toOriginal()
                                default:
                                        return save(toType, failure())
                        }
                },
                toUndefined() {
                        const toType = TYPE.UNDEFINED
                        if (cache.has(toType)) return cache.get(toType)
                        return save(toType, success(undefined))
                },
        }
        return value
}
