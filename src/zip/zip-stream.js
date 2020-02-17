import ZipTransformer from './zip-transformer.js'

function ZipStream() {
    TransformStream.call(this, new ZipTransformer())
}

ZipStream.prototype = Object.create(TransformStream.prototype);
ZipStream.prototype.constructor = ZipStream;

export default ZipStream
