import ZipTransformer from './zip-transformer'

class ZipStream extends TransformStream {
    constructor() {
        super(new ZipTransformer())
    }
}

export default ZipStream
