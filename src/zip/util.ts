export function getTimeStruct(date: any) {
    return ((((date.getHours() << 6) | date.getMinutes()) << 5) | date.getSeconds() / 2)
}

export function getDateStruct(date: any) {
    return (((((date.getFullYear() - 1980) << 4) | (date.getMonth() + 1)) << 5) | date.getDate())
}

export function getDateTimeDOS(date: any) {
    return ((date.getFullYear() - 1980 << 25) | (date.getMonth() + 1) << 21) | (date.getDate() << 16) |
        (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() / 2);
}
