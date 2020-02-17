import Archiver from './archiver.js'

function WebZipStream() {
    // WebZipStream API
}

WebZipStream.prototype.archiver = function(options) {
    if (!(this.archiver instanceof Archiver)) {
        this.archiver = new Archiver();
        return this.archiver
    }
};

export default WebZipStream
