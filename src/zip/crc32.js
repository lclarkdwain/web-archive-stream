function Crc32() {
    this.crc = -1
}

Crc32.prototype = {
    append(data) {
        for (let offset = 0; offset < data.length; offset++) {
            this.crc = (this.crc >>> 8) ^ this.table[(this.crc ^ data[offset]) & 0xFF]
        }
    },
    get() {
        return (this.crc ^ (-1)) >>> 0
    }
};

Crc32.prototype.table = (() => {
    let i; let j; let t; const table = []
    for (i = 0; i < 256; i++) {
        t = i;
        for (j = 0; j < 8; j++) {
            t = (t & 1)
                ? (t >>> 1) ^ 0xEDB88320
                : t >>> 1
        }
        table[i] = t
    }
    return table
})();

export default Crc32
