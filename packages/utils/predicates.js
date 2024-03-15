export const isObject = (value) => {
        return (typeof value == "object") && value !== null
}

// https://adamcoster.com/blog/pojo-detector
export const isPlainObject = (value) => {
        // NOTE(aes): null can be a prototype via Object.create(null)
        return isObject(value) && [null, Object.prototype].includes(Object.getPrototypeOf(value))
}
