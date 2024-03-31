import { always } from "./always.js"

export const functionalize = (maybeFn) =>
        typeof maybeFn === "function"
                ? maybeFn
                : always(maybeFn)
