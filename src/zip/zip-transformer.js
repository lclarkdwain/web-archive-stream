import Crc32 from './crc32.js'
import constants from './constants.js'
import { BinaryWriter } from './binary-util.js'
import { getTimeStruct, getDateStruct } from './util.js'

const textEncoder = new TextEncoder();
function ZipTransformer() {
    // ZipTransformer Object
    this.entry = null;
    this.entries = {};
}

ZipTransformer.prototype = {
    async transform(entry, ctrl) {
        let name = entry.name.trim();
        const date = new Date(entry.lastModified ? entry.lastModified : new Date());

        const nameBuffer = textEncoder.encode(name);
        const zipEntry = this.entries[name] = {
            offset: this.offset,
            crc: new Crc32(),
            compressedSize: BigInt(0),
            size: BigInt(0),
            nameBuffer

        };
        // LOCAL FILE HEADER
        const localFileHeader = new BinaryWriter()
            .writeInt32(constants.SIG_LFH)
            .writeInt16(0x002D)
            .writeInt16(0x0808)
            .writeInt16(0x0000)
            .writeInt16(getTimeStruct(date))
            .writeInt16(getDateStruct(date))
            .writeInt32(0x00000000)
            .writeInt32(0x00000000)
            .writeInt32(0x00000000)
            .writeInt16(nameBuffer.length)
            .writeInt16(0)
            .writeInt16(nameBuffer)
            .writeInt16([]);
        ctrl.enqueue(localFileHeader.arrayBuffer);
        // FILE DATA
        if (entry.stream) {
            const reader = entry.stream().getReader();
            while(true) {
                const { done, value } = await reader.read();
                if (done) break;
                zipEntry.crc.append(value);
                zipEntry.compressedSize += BigInt(value.length);
                zipEntry.size += BigInt(value.length);
                ctrl.enqueue(value)
            }
        }
        // DATA DESCRIPTOR
        const dataDescriptor = new BinaryWriter()
            .writeInt32([80, 75, 7, 8])
            .writeInt32(zipEntry.crc.get())
            .writeInt32(zipEntry.compressedSize)
            .writeInt32(zipEntry.size);
        ctrl.enqueue(dataDescriptor.arrayBuffer)
    },
    flush() {
        // CENTRAL DIRECTORY FILE HEADER
        // ZIP64 END OF CENTRAL DIRECTORY RECORD / LOCATOR
        // END OF CENTRAL DIRECTORY RECORD
    }
};

export default ZipTransformer
