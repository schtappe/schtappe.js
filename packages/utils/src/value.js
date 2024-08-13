import { isPlainObject } from "./predicates.js"
import { identity } from "./identity.js"

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

const genericArray = (data) => ([data])
const entriesArray = (data) => Array.from(data)
const objectArray = (data) => Object.entries(data)

const genericBoolean = (data) => !!data

const booleanBigint = (data) => data ? 1 : 0

const genericBigint = (data) => BigInt(data)

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

const entriesFormdata = (data) => {
        const queue = Array.from(data).map(([key, value]) => ({
                v: value,
                ks: [key]
        }))
        const result = flatten(queue)
        return result
}
const arrayFormdata = (data) => entriesFormdata(data.entries())
const objectFormdata = (data) => entriesFormdata(Object.entries(data))
const setFormdata = (data) => entriesFormdata(Array.from(data).entries())

const genericFunction = (data) => () => data

const entriesMap = (data) => new Map(data.entries())
const objectMap = (data) => new Map(Object.entries(data))

const bigintNumber = (data) => Number(data)
const booleanNumber = (data) => data ? 1 : 0

const entriesObject = (data) => Object.fromEntries(data.entries())

const arraySet = (data) => new Set(data)
const formdataSet = (data) => new Set(data.values())
const genericSet = (data) => new Set([data])
const mapSet = formdataSet
const objectSet = (data) => new Set(Object.values(data))

const genericString = (data) => String(data)
const arrayString = (data) => String(Array.from(data))
const formdataString = arrayString
const mapString = arrayString
const objectString = (data) => String(Object.entries(data))
const setString = arrayString
const symbolString = (data) => data.description

const stringSymbol = (data) => Symbol(data)

const nullify = () => null
const undefinedify = () => undefined

const table = new Map([
        [TYPE.ARRAY, new Map([
                [TYPE.ARRAY, identity],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, arrayFormdata],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, entriesMap],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, entriesObject],
                [TYPE.SET, arraySet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.BIGINT, new Map([
                [TYPE.ARRAY, genericArray],
                [TYPE.BIGINT, identity],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, bigintNumber],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.BOOLEAN, new Map([
                [TYPE.ARRAY, genericArray],
                [TYPE.BIGINT, booleanBigint],
                [TYPE.BOOLEAN, identity],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, booleanNumber],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.FORMDATA, new Map([
                [TYPE.ARRAY, entriesArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, identity],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, entriesMap],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, entriesObject],
                [TYPE.SET, formdataSet],
                [TYPE.STRING, formdataString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.FUNCTION, new Map([
                [TYPE.ARRAY, genericArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, identity],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.MAP, new Map([
                [TYPE.ARRAY, entriesArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, entriesFormdata],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, identity],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, entriesObject],
                [TYPE.SET, mapSet],
                [TYPE.STRING, mapString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.NULL, new Map([
                [TYPE.ARRAY, null],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, identity],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.NUMBER, new Map([
                [TYPE.ARRAY, genericArray],
                [TYPE.BIGINT, genericBigint],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, identity],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.OBJECT, new Map([
                [TYPE.ARRAY, objectArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, objectFormdata],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, objectMap],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, identity],
                [TYPE.SET, objectSet],
                [TYPE.STRING, objectString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.SET, new Map([
                [TYPE.ARRAY, entriesArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, setFormdata],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, entriesMap],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, entriesObject],
                [TYPE.SET, identity],
                [TYPE.STRING, setString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.STRING, new Map([
                [TYPE.ARRAY, genericArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, identity],
                [TYPE.SYMBOL, stringSymbol],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.SYMBOL, new Map([
                [TYPE.ARRAY, genericArray],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, symbolString],
                [TYPE.SYMBOL, identity],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.UNDEFINED, new Map([
                [TYPE.ARRAY, null],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, identity],
                [TYPE.UNKNOWN, null],
        ])],
        [TYPE.UNKNOWN, new Map([
                [TYPE.ARRAY, null],
                [TYPE.BIGINT, null],
                [TYPE.BOOLEAN, genericBoolean],
                [TYPE.FORMDATA, null],
                [TYPE.FUNCTION, genericFunction],
                [TYPE.MAP, null],
                [TYPE.NULL, nullify],
                [TYPE.NUMBER, null],
                [TYPE.OBJECT, null],
                [TYPE.SET, genericSet],
                [TYPE.STRING, genericString],
                [TYPE.SYMBOL, null],
                [TYPE.UNDEFINED, undefinedify],
                [TYPE.UNKNOWN, null],
        ])],
])

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

const toValue = (fromType, toType, data) => {
        const handler = table.get(fromType).get(toType)
        if (!handler) return failure()
        return success(handler(data))
}

export const toArray = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.ARRAY, data)
}

export const toBigint = (data) => {
        const fromType = getType(data)
        if (fromType == TYPE.STRING) {
                try {
                        return success(BigInt(data))
                } catch (error) {
                        return failure()
                }
        }
        return toValue(fromType, TYPE.BIGINT, data)
}

export const toBoolean = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.BOOLEAN, data)
}

export const toFormdata = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.FORMDATA, data)
}

export const toFunction = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.FUNCTION, data)
}

export const toMap = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.MAP, data)
}

export const toNull = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.NULL, data)
}

export const toNumber = (data) => {
        const fromType = getType(data)
        if (fromType == TYPE.STRING) {
                try {
                        const result = Number(data)
                        if (Number.isNaN(result))
                                return failure()
                        return success(result)
                } catch (error) {
                        return failure()
                }
        }
        return toValue(fromType, TYPE.NUMBER, data)
}

export const toObject = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.OBJECT, data)
}

export const toSet = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.SET, data)
}

export const toString = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.STRING, data)
}

export const toSymbol = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.SYMBOL, data)
}

export const toUndefined = (data) => {
        const fromType = getType(data)
        return toValue(fromType, TYPE.UNDEFINED, data)
}
