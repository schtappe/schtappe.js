export const object = {
        toFormData(value = {}) {
                return Object.entries(value).reduce((result, [key, value]) => {
                        result.append(key, value)
                        return result
                }, new FormData())
        }
}
