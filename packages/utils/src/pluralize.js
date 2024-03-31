export const pluralize = (number = 0, singular = "", plural = "") =>
        number === 1
                ? singular
                : plural
