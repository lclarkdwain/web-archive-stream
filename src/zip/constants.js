export default {
    SIG_LFH: 0x04034b50,
    SIG_DD: 0x08074b50,
    SIG_CFH: 0x02014b50,
    SIG_EOCD: 0x06054b50,
    SIG_ZIP64_EOCD: 0x06064B50,
    SIG_ZIP64_EOCD_LOC: 0x07064B50,

    ZIP64_MAGIC_SHORT: 0xffff,
    ZIP64_MAGIC: 0xffffffff,
    ZIP64_EXTRA_ID: 0x0001,

    MODE_MASK: 0xFFF,
    DEFAULT_FILE_MODE: 33188, // 010644 = -rw-r--r-- = S_IFREG | S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH
    DEFAULT_DIR_MODE: 16877,  // 040755 = drwxr-xr-x = S_IFDIR | S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH

    EXT_FILE_ATTR_DIR: 1106051088,  // 010173200020 = drwxr-xr-x = (((S_IFDIR | 0755) << 16) | S_DOS_D)
    EXT_FILE_ATTR_FILE: 2175008800, // 020151000040 = -rw-r--r-- = (((S_IFREG | 0644) << 16) | S_DOS_A) >>> 0

    // Unix file types
    S_IFMT: 61440,   // 0170000 type of file mask
    S_IFIFO: 4096,   // 010000 named pipe (fifo)
    S_IFCHR: 8192,   // 020000 character special
    S_IFDIR: 16384,  // 040000 directory
    S_IFBLK: 24576,  // 060000 block special
    S_IFREG: 32768,  // 0100000 regular
    S_IFLNK: 40960,  // 0120000 symbolic link
    S_IFSOCK: 49152, // 0140000 socket

    // DOS file type flags
    S_DOS_A: 32, // 040 Archive
    S_DOS_D: 16, // 020 Directory
    S_DOS_V: 8,  // 010 Volume
    S_DOS_S: 4,  // 04 System
    S_DOS_H: 2,  // 02 Hidden
    S_DOS_R: 1   // 01 Read Only
}
