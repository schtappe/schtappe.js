export const once = (fn) => {
        const result = fn()
        return () => result
}
