function createArrayBuffer(value, size) { // handler
    const arrayBuffer = new Uint8Array(size);
    const dataView = new DataView(arrayBuffer.buffer);
    switch (size) {
        case 1:
            dataView.setInt8(0, parseInt(value));
            break;
        case 2:
            dataView.setInt16(0, parseInt(value), true);
            break;
        case 4:
            dataView.setInt32(0, parseInt(value), true);
            break;
        case 8:
            dataView.setBigInt64(0, BigInt(value), true);
            break;
        default:
            const error = `createArrayBuffer: no handler defined`;
            console.error(error);
            throw error
    }
    return arrayBuffer
}

export function BinaryWriter() {
    this.arrayBuffer = new Uint8Array(0);
}

BinaryWriter.prototype = {
    writeInt8(value) {
        const arrayBuffer = createArrayBuffer(value, 1);
        this.arrayBuffer = new Uint8Array([...this.arrayBuffer, ...arrayBuffer]);
        return this
    },
    writeInt16(value) {
        const arrayBuffer = createArrayBuffer(value, 2);
        this.arrayBuffer = new Uint8Array([...this.arrayBuffer, ...arrayBuffer]);
        return this
    },
    writeInt32(value) {
        const arrayBuffer = createArrayBuffer(value, 4);
        this.arrayBuffer = new Uint8Array([...this.arrayBuffer, ...arrayBuffer]);
        return this
    },
    writeBigInt64(value) {
        const arrayBuffer = createArrayBuffer(value, 8);
        this.arrayBuffer = new Uint8Array([...this.arrayBuffer, ...arrayBuffer]);
        return this
    },
    writeBytes(value) {
        const size = value.length;
        const arrayBuffer = new Uint8Array(size);
        arrayBuffer.set(value, 0);
        this.arrayBuffer = new Uint8Array([...this.arrayBuffer, ...arrayBuffer]);
        return this
    },
    get size() {
        return this.arrayBuffer.length
    }
};
