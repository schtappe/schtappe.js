export const omit = (props = [], object = {}) => {
        return Object.keys(object).reduce((result, key) => {
                if (!props.includes(key))
                        result[key] = object[key]
                return result
        }, {})
}
