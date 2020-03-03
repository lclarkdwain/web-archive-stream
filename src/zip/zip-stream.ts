import ZipTransformer from './zip-transformer'

class ZipStream extends TransformStream {
    constructor() {
        // @ts-ignore
        super(new ZipTransformer())
    }
}

export default ZipStream
