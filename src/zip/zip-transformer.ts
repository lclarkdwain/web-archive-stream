import Crc32 from './crc32.js'
import constants from './constants'
import BinaryStream from '../util/binary-stream.js'
import { getDateTimeDOS } from './util'

const textEncoder = new TextEncoder();

class ZipTransformer {
    private forceZip64 = false;
    private entry: any = null;
    private entries: any = {};

    private offset: bigint = BigInt(0);
    private centralOffset: bigint = BigInt(0);
    private centralSize: bigint = BigInt(0);


    private async transform(entry: any, ctrl: any) {
        let name = entry.name.trim();
        const date = new Date(entry.lastModified ? entry.lastModified : new Date());

        const nameBuffer = textEncoder.encode(name);
        // define new entry
        this.entry = this.entries[name] = {
            offset: this.offset as any,
            crc: new Crc32(),
            compressedSize: BigInt(0),
            size: BigInt(0),
            nameBuffer,
            date,
            get isZip64() {
                return this.compressedSize > constants.ZIP64_MAGIC || this.size > constants.ZIP64_MAGIC
            },
            extra: new Uint8Array(0)

        };
        // LOCAL FILE HEADER
        const localFileHeader = new BinaryStream()
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
            .writeBytes(this.entry.extra)
            .getByteArray();
        ctrl.enqueue(localFileHeader);
        this.offset += BigInt(localFileHeader.length);
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
        let dataDescriptor = new BinaryStream()
            .writeInt32(constants.SIG_DD)
            .writeInt32(this.entry.crc.get());
        if (this.entry.isZip64) {
            dataDescriptor
                .writeBigInt64(this.entry.compressedSize)
                .writeBigInt64(this.entry.size);
        } else {
            dataDescriptor
                .writeInt32(this.entry.compressedSize)
                .writeInt32(this.entry.size);
        }
        let dataDescriptorByteArray = dataDescriptor.getByteArray();
        ctrl.enqueue(dataDescriptorByteArray);
        this.offset += this.entry.size + BigInt(dataDescriptorByteArray.length)
    }
    flush(ctrl: any) {
        // CENTRAL DIRECTORY FILE HEADER
        this.centralOffset = this.offset;
        Object.keys(this.entries).forEach(function(key: any) {
            // @ts-ignore
            const entry = this.entries[key];
            let fileOffset = entry.offset;
            let size = entry.size;
            let compressedSize = entry.compressedSize;

            if (entry.isZip64 || entry.offset > constants.ZIP64_MAGIC) {
                fileOffset = constants.ZIP64_MAGIC;
                size = constants.ZIP64_MAGIC;
                compressedSize = constants.ZIP64_MAGIC;

                const createZip64ExtraField = new BinaryStream()
                    .writeInt16(constants.ZIP64_EXTRA_ID)
                    .writeInt16(24)
                    .writeBigInt64(entry.size) // 8
                    .writeBigInt64(entry.compressedSize)
                    .writeBigInt64(entry.offset);
                entry.extra = createZip64ExtraField.getByteArray()
            }
            const centralDirectoryFileHeader = new BinaryStream()
                .writeInt32(constants.SIG_CFH)
                .writeInt16(0x002D)
                .writeInt16(0x002D)
                .writeInt16(0x0808)
                .writeInt16(0x0000)
                .writeInt32(getDateTimeDOS(entry.date))
                .writeInt32(entry.crc.get())
                .writeInt32(compressedSize)
                .writeInt32(size)
                .writeInt16(entry.nameBuffer.length)
                .writeInt16(entry.extra.length) // extra field length
                .writeInt16(0x0000)
                .writeInt16(0x0000)
                .writeInt16(0x0000)
                .writeInt32(0x00000000)
                .writeInt32(fileOffset)
                .writeBytes(entry.nameBuffer)
                .writeBytes(entry.extra)
                .getByteArray();
            ctrl.enqueue(centralDirectoryFileHeader);
            this.offset += BigInt(centralDirectoryFileHeader.length);
        }.bind(this));
        this.centralSize = this.offset - this.centralOffset;
        // ZIP64 END OF CENTRAL DIRECTORY RECORD / LOCATOR
        if (this.isZip64) {
            // RECORD
            const zip64EOCDirectoryRecord = new BinaryStream()
                .writeInt32(constants.SIG_ZIP64_EOCD)
                .writeBigInt64(44)
                .writeInt16(0x002D)
                .writeInt16(0x002D)
                .writeInt32(0)
                .writeInt32(0)
                .writeBigInt64(Object.keys(this.entries).length)
                .writeBigInt64(Object.keys(this.entries).length)
                .writeBigInt64(this.centralSize)
                .writeBigInt64(this.centralOffset)
                .getByteArray();
            ctrl.enqueue(zip64EOCDirectoryRecord);
            this.offset += BigInt(zip64EOCDirectoryRecord.length);
            // LOCATOR
            const zip64EOCDirectoryLocator = new BinaryStream()
                .writeInt32(constants.SIG_ZIP64_EOCD_LOC)
                .writeInt32(0)
                .writeBigInt64(this.centralOffset + this.centralSize)
                .writeInt32(1)
                .getByteArray();
            ctrl.enqueue(zip64EOCDirectoryLocator);
            this.offset += BigInt(zip64EOCDirectoryLocator.length);

        }
        // END OF CENTRAL DIRECTORY RECORD
        let entriesSize = Object.keys(this.entries).length;
        let centralSize = this.centralSize;
        let centralOffset = this.centralOffset;
        if (this.isZip64) {
            entriesSize = constants.ZIP64_MAGIC_SHORT;
            // @ts-ignore
            centralSize = constants.ZIP64_MAGIC;
            // @ts-ignore
            centralOffset = constants.ZIP64_MAGIC;
        }
        const endOfCentralDirectoryRecord = new BinaryStream()
            .writeInt32(constants.SIG_EOCD)
            .writeInt16(0)
            .writeInt16(0)
            .writeInt16(entriesSize)
            .writeInt16(entriesSize)
            .writeInt32(centralSize)
            .writeInt32(centralOffset)
            .writeInt16(0)
            .getByteArray();
        ctrl.enqueue(endOfCentralDirectoryRecord);
        this.offset += BigInt(endOfCentralDirectoryRecord.length)
    }
    get isZip64() {
        return this.forceZip64 || Object.keys(this.entries).length > constants.ZIP64_MAGIC_SHORT || this.centralSize > constants.ZIP64_MAGIC || this.centralOffset > constants.ZIP64_MAGIC;
    }
}

export default ZipTransformer
