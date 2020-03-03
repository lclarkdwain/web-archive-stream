import ZipStream from './zip/zip-stream'

class Archiver {
    public stream: ZipStream;

    constructor() {
        //
        this.stream = new ZipStream();
    }
}

export default Archiver
