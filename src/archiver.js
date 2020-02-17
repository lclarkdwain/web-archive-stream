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
    for (const i in Array.from(Array(2).keys())) {
        writer.write(new File(["foo--" + i], i + "-foo.txt", {
            type: "text/plain"
        }))
    }
    zipStream.readable.pipeTo(fileStream);
    writer.close()
};

export default Archiver
