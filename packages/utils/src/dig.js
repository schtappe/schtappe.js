export const dig = (dot = "", object = {}) => {
        return dot.split(".").reduce((result, key) => {
                if (result == null) return result
                result = result[key]
                return result
        }, object)
}
