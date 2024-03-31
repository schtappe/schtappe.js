export const capitalize = (value) => {
        value = String(value)
        return value.charAt(0).toLocaleUpperCase() + value.slice(1)
}
