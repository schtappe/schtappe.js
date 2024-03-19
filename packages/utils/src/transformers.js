import { isPlainObject } from "./predicates.js"

// (Object, String) => [ [String, Value], ... ]
const getEntries = (root, baseKey) => {
        if (!isPlainObject(root)) return [[baseKey, root]]

        const result = []

        Object.entries(root).forEach(([innerKey, value]) => {
                const key = !baseKey ? innerKey : `${baseKey}[${innerKey}]`
                result.push(...getEntries(value, key))
        })

        return result
}

export const object = {
        toFormData(value = {}) {
                const result = new FormData()
                getEntries(value, "").forEach(([key, value]) => result.append(key, value))
                return result
        }
}
