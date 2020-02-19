import BinaryUtil from './binary-util.js'

export default function BinaryStream() {
    this.byteArray = new Uint8Array(0); // Uint8Array[] typed array
}

BinaryStream.prototype = {
    writeInt8(data) {
        this.byteArray = BinaryUtil.createByteArray(data, 1, this.byteArray);
        return this
    },
    writeInt16(data) {
        this.byteArray = BinaryUtil.createByteArray(data, 2, this.byteArray);
        return this
    },
    writeInt32(data) {
        this.byteArray = BinaryUtil.createByteArray(data, 4, this.byteArray);
        return this
    },
    writeBigInt64(data) {
        this.byteArray = BinaryUtil.createByteArray(data, 8, this.byteArray);
        return this
    },
    writeBytes(data) { // data === bytes[]
        this.byteArray = BinaryUtil.createByteArray(data, data.length, this.byteArray);
        return this
    },
    /**
     *
     * @returns {Uint8Array}
     */
    getByteArray() {
        return this.byteArray
    }
};
