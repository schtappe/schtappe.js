export const pick = (props = [], object = {}) => {
        return props.reduce((result, prop) => {
                if (object.hasOwnProperty(prop))
                        result[prop] = object[prop]
                return result
        }, {})
}
