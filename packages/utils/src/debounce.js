// TODO: how to make sure clearTimeout and setTimeout exist?
export const debounce = (ms, fn) => {
        let timeoutId = null
        return function(...args) {
                if (timeoutId) clearTimeout(timeoutId)
                timeoutId = setTimeout(fn.bind(this, ...args), ms)
        }
}
