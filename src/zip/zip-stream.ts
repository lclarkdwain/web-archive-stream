import ZipTransformer from './zip-transformer'

const ponyfill = WebStreamsPolyfill;

class ZipStream extends (TransformStream || ponyfill.TransformStream) {
    constructor() {
        // @ts-ignore
        super(new ZipTransformer())
    }
}

export default ZipStream
