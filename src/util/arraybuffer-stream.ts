class ArrayBufferStream extends ArrayBuffer {
    private offset: number;
    private view: DataView;
    private readonly typedArray: Uint8Array;

    constructor(size: number) {
        super(size);
        this.offset = 0;
        this.view = new DataView(this);
        this.typedArray = new Uint8Array(this);
    }

    writeBytes(bytes: ArrayLike<number>) {
        this.typedArray.set(bytes, this.offset);
        this.offset += bytes.length;
        return this
    }

    writeInt8(value: any) {
        this.view.setInt8(this.offset, parseInt(value));
        this.offset += 1;
        return this
    }

    writeInt16(value: any, littleEndian: boolean = true) {
        this.view.setInt16(this.offset, parseInt(value), littleEndian);
        this.offset += 2;
        return this
    }

    writeInt32(value: any, littleEndian: boolean = true) {
        this.view.setInt32(this.offset, parseInt(value), littleEndian);
        this.offset += 4;
        return this
    }

    // 64-bit
    writeBigInt64(value: any, littleEndian: boolean = true) {
        this.view.setBigInt64(this.offset, BigInt(value), littleEndian);
        this.offset += 8;
        return this
    }

    getOffset() {
        return this.offset
    }

    getTypedArray() {
        return this.typedArray
    }
}

export default ArrayBufferStream
