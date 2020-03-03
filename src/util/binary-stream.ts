import BinaryUtil from './binary-util.js'

export default class BinaryStream {
    public byteArray: Uint8Array;

    constructor() {
        this.byteArray = new Uint8Array(0); // Uint8Array[] typed array
    }

    writeInt8(data: any) {
        this.byteArray = BinaryUtil.createByteArray(data, 1, this.byteArray);
        return this
    }
    writeInt16(data: any) {
        this.byteArray = BinaryUtil.createByteArray(data, 2, this.byteArray);
        return this
    }
    writeInt32(data: any) {
        this.byteArray = BinaryUtil.createByteArray(data, 4, this.byteArray);
        return this
    }
    writeBigInt64(data: any) {
        this.byteArray = BinaryUtil.createByteArray(data, 8, this.byteArray);
        return this
    }
    writeBytes(data: any) { // data === bytes[]
        this.byteArray = BinaryUtil.createByteArray(data, data.length, this.byteArray);
        return this
    }
    /**
     *
     * @returns {Uint8Array}
     */
    getByteArray(): Uint8Array {
        return this.byteArray
    }
}
