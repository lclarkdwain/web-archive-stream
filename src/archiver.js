import ZipStream from './zip/zip-stream.js'

function Archiver() {
    // Archiver
    this.files = [];
}

Archiver.prototype.file = function(file) {
    this.files.push(file)
};

Archiver.prototype.pipe = function(fileStream) {
    const zipStream = new ZipStream();
    const writer = zipStream.writable.getWriter();
    for (const file of this.files) {
        writer.write(file)
    }
    zipStream.readable.pipeTo(fileStream);
    writer.close();
    this.files = []
};

export default Archiver
