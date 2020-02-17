export function getTimeStruct(date) {
    return ((((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2)
}

export function getDateStruct(date) {
    return (((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate())
}
