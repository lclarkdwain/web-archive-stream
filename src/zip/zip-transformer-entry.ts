import Crc32 from "./crc32";
import constants from "./constants";

const textEncoder = new TextEncoder();

class ZipTransformerEntry {
    name: string;
    offset: bigint;
    crc: Crc32;
    compressedSize: bigint;
    size: bigint;
    date: Date;
    extra: Uint8Array;

    constructor(name: string, offset: bigint, entry: any) {
        this.name = name.replace(/\s+/g, '_');
        this.offset = offset;
        this.crc = new Crc32();
        this.compressedSize = BigInt(0);
        this.size = BigInt(0);
        this.date = new Date(entry.lastModified ? entry.lastModified : new Date());
        this.extra = new Uint8Array(0)
    }

    get nameBuffer() {
        return textEncoder.encode(this.name);
    }

    isZip64(): boolean {
        return this.compressedSize > constants.ZIP64_MAGIC || this.size > constants.ZIP64_MAGIC
    }
}

export default ZipTransformerEntry
