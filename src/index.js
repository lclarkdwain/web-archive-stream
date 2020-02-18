import Archiver from './archiver.js'

function WebZipStream(type) {
    // WebZipStream API
    this.type = type
}

WebZipStream.prototype.archiver = function(options) {
    if (!(this.archiver instanceof Archiver)) {
        this.archiver = new Archiver();
        return this.archiver
    }
};

export default WebZipStream
