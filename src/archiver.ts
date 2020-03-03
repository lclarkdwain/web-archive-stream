import ZipStream from './zip/zip-stream'

function _Archiver() {
    // Archiver
    this.stream = new ZipStream();
    this.files = [];
}

_Archiver.prototype.file = function(file: any) {
    this.files.push(file)
};

_Archiver.prototype.pipe = function(fileStream: any) {
    const writer = this.stream.writable.getWriter();
    for (const file of this.files) {
        writer.write(file)
    }
    this.stream.readable.pipeTo(fileStream);
    writer.close();
    this.files = []
};

class Archiver {
    public stream: ZipStream;
    files: File[];

    constructor() {
        //
        this.stream = new ZipStream();
        this.files = []
    }

    file(file: any) {
        this.files.push(file)
    };

    pipe(fileStream: any) {
        const writer = this.stream.writable.getWriter();
        for (const file of this.files) {
            writer.write(file)
        }
        this.stream.readable.pipeTo(fileStream);
        writer.close();
        this.files = []
    };

}

export default Archiver
