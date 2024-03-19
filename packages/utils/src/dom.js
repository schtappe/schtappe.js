// TODO(aes): how to test this file if it depends on dom?

// https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
export const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename || "download"

        const clickHandler = () => {
                setTimeout(() => {
                        URL.revokeObjectURL(url)
                        a.removeEventListener("click", clickHandler)
                }, 150)
        }
        a.addEventListener("click", clickHandler, false)
        a.click()

        return a
}
