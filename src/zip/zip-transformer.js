import Crc32 from './crc32.js'
import constants from './constants.js'
import { BinaryWriter } from './binary-util.js'
import { getDateTimeDOS } from './util.js'

const textEncoder = new TextEncoder();
function ZipTransformer() {
    this.isZip64 = false;
    this.entry = null;
    this.entries = {};

    this.offset = BigInt(0);
    this.centralOffset = BigInt(0);
    this.centralSize = BigInt(0);
}

ZipTransformer.prototype = {
    async transform(entry, ctrl) {
        let name = entry.name.trim();
        const date = new Date(entry.lastModified ? entry.lastModified : new Date());

        const nameBuffer = textEncoder.encode(name);
        // define new entry
        this.entry = this.entries[name] = {
            offset: this.offset,
            crc: new Crc32(),
            compressedSize: BigInt(0),
            size: BigInt(0),
            nameBuffer,
            date

        };
        // LOCAL FILE HEADER
        const localFileHeader = new BinaryWriter()
            .writeInt32(constants.SIG_LFH)
            .writeInt16(0x002D)
            .writeInt16(0x0808)
            .writeInt16(0x0000)
            .writeInt32(getDateTimeDOS(date)) // 4 bytes
            .writeInt32(0x00000000)
            .writeInt32(0x00000000)
            .writeInt32(0x00000000)
            .writeInt16(nameBuffer.length)
            .writeInt16(0)
            .writeBytes(nameBuffer)
            .writeBytes([]);
        ctrl.enqueue(localFileHeader.arrayBuffer);
        console.log(this.entry)
        // FILE DATA
        if (entry.stream) {
            const reader = entry.stream().getReader();
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                this.entry.crc.append(value);
                this.entry.compressedSize += BigInt(value.length);
                this.entry.size += BigInt(value.length);
                ctrl.enqueue(value)
            }
        }
        // DATA DESCRIPTOR
        const dataDescriptor = new BinaryWriter()
            .writeInt32(constants.SIG_DD)
            .writeInt32(this.entry.crc.get())
            .writeInt32(this.entry.compressedSize)
            .writeInt32(this.entry.size);
        ctrl.enqueue(dataDescriptor.arrayBuffer);

        this.offset += [
            localFileHeader.size,
            this.entry.size,
            dataDescriptor.size
        ].reduce((acc, curr) => acc + BigInt(curr), BigInt(0));
    },
    flush(ctrl) {
        // CENTRAL DIRECTORY FILE HEADER
        this.centralOffset = this.offset;
        Object.keys(this.entries).forEach(function(key) {
            const entry = this.entries[key];
            const centralDirectoryFileHeader = new BinaryWriter()
                .writeInt32(constants.SIG_CFH)
                .writeInt16(0x002D)
                .writeInt16(0x002D)
                .writeInt16(0x0808)
                .writeInt16(0x0000)
                .writeInt32(getDateTimeDOS(entry.date))
                .writeInt32(entry.crc.get())
                .writeInt32(entry.compressedSize)
                .writeInt32(entry.size)
                .writeInt16(entry.nameBuffer.length)
                .writeInt16(0)
                .writeInt16(0x0000)
                .writeInt16(0x0000)
                .writeInt16(0x0000)
                .writeInt32(0x00000000)
                .writeInt32(entry.offset)
                .writeBytes(entry.nameBuffer)
                .writeBytes([]);
            ctrl.enqueue(centralDirectoryFileHeader.arrayBuffer);
            this.offset += BigInt(centralDirectoryFileHeader.size)
            console.log(centralDirectoryFileHeader.size)
            }.bind(this));
        this.centralSize = this.offset - this.centralOffset;
        console.log(this.centralSize)
        // ZIP64 END OF CENTRAL DIRECTORY RECORD / LOCATOR
        if (this.isZip64) {
            const zip64EOCDirectoryRecord = new BinaryWriter();
            const zip64EOCDirectoryLocator = new BinaryWriter();
        }
        // END OF CENTRAL DIRECTORY RECORD
        const endOfCentralDirectoryRecord = new BinaryWriter()
            .writeInt32(constants.SIG_EOCD)
            .writeInt16(0)
            .writeInt16(0)
            .writeInt16(Object.keys(this.entries).length)
            .writeInt16(Object.keys(this.entries).length)
            .writeInt32(this.centralSize)
            .writeInt32(this.centralOffset)
            .writeInt16(0);
        ctrl.enqueue(endOfCentralDirectoryRecord.arrayBuffer);
        this.offset += BigInt(endOfCentralDirectoryRecord.size)
    }
};

export default ZipTransformer
