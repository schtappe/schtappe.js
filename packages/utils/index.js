export const capitalize = (value) => {
        value = String(value)
        return value.charAt(0).toLocaleUpperCase() + value.slice(1)
}

export const functionalize = (maybeFn) =>
        typeof maybeFn == "function"
                ? maybeFn
                : () => maybeFn

export const pick = (props = []) => (object = {}) => {
        return props.reduce((result, prop) => {
                result[prop] = object[prop]
                return result
        }, {})
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
