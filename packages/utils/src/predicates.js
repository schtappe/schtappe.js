export const isObject = (value) => {
        return (typeof value == "object") && value !== null
}

// https://adamcoster.com/blog/pojo-detector
export const isPlainObject = (value) => {
        // NOTE(aes): null can be a prototype via Object.create(null)
        return isObject(value) && [null, Object.prototype].includes(Object.getPrototypeOf(value))
}

// NOTE: new String("...") is not checked because it is not good practice
// to used new String() in the first place
// https://stackoverflow.com/a/4059166
export const isString = (x) => typeof x === "string"
