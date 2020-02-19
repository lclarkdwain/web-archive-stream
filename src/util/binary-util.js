export default  {
    createByteArray(data, byteLength, mergeByteArray = []) {
        let byteArray = new Uint8Array(byteLength);
        const dataView = new DataView(byteArray.buffer);

        const isArrayLike = function(data) {
            // Uint8Array is not instance of Array
            return Array.isArray(data) || (!!data &&
                typeof data == 'object' &&
                typeof data.length === 'number')
        };

        if (isArrayLike(data)) {
            // if array or array-like (iterable)
            byteArray.set(data, 0);
        } else {
            // data might be string / integer
            const int = parseInt(data); // parse to make sure and try to convert hex
            switch (byteLength) {
                case 1:
                    dataView.setInt8(0, int);
                    break;
                case 2:
                    dataView.setInt16(0, int, true);
                    break;
                case 4:
                    dataView.setInt32(0, int, true);
                    break;
                case 8:
                    dataView.setBigInt64(0, BigInt(int), true);
                    break;
                default:
                    const errorString = `BinaryStream.createByteArray: ${byteLength}-byte(s) size array is not supported`;
                    console.error(errorString);
                    throw errorString;
            }
        }
        // check if there is array to be merge first
        // alternatives is by using spread syntax [...array, ...array2]
        if (!!mergeByteArray && isArrayLike(mergeByteArray)) {
            let tmp = new Uint8Array(mergeByteArray.length + byteArray.length);
            tmp.set(mergeByteArray);
            tmp.set(byteArray, mergeByteArray.length);
            // modify output byteArray
            byteArray = tmp
        }
        return byteArray
    },
    createByte(data) {
        return this.createByteArray(data, 1)
    },
    createShort(data) {
        return this.createByteArray(data, 2)
    },
    createLong(data) {
        return this.createByteArray(data, 4)
    },
    createLongLong(data) {
        return this.createByteArray(data, 8)
    }
};
