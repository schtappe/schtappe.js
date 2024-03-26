import { isPlainObject } from "./predicates.js"

// (Object, String) => [ [String, Value], ... ]
// TODO(aes): simplify (deduplicate) this
const getEntries = (root, baseKey) => {
        if (!(isPlainObject(root) || Array.isArray(root))) return [[baseKey, root]]

        const result = []
        if (isPlainObject(root)) {
                Object.entries(root).forEach(([innerKey, value]) => {
                        const key = !baseKey ? innerKey : `${baseKey}[${innerKey}]`
                        result.push(...getEntries(value, key))
                })
        } else {
                root.forEach((value, innerKey) => {
                        const key = !baseKey ? innerKey : `${baseKey}[${innerKey}]`
                        result.push(...getEntries(value, key))
                })
        }

        return result
}

export const object = {
        toFormData(value = {}) {
                const result = new FormData()
                getEntries(value, "").forEach(([key, value]) => result.append(key, value))
                return result
        }
}
