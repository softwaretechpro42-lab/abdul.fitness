import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Minimal ZIP archive builder in pure Node without external dependencies.
 */
function createZip(files, outputPath) {
  const fileRecords = [];
  let offset = 0;
  const chunks = [];

  for (const file of files) {
    const fileNameBuf = Buffer.from(file.name, 'utf8');
    const contentBuf = file.content;
    const uncompressedSize = contentBuf.length;

    // Deflate
    const compressedData = zlib.deflateRawSync(contentBuf);
    const compressedSize = compressedData.length;

    // CRC32
    let crc = -1;
    for (let i = 0; i < contentBuf.length; i++) {
      let byte = contentBuf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) crc = (crc >>> 1) ^ 0xedb88320;
        else crc = crc >>> 1;
        byte = byte >>> 1;
      }
    }
    const fileCrc = (crc ^ -1) >>> 0;

    // Local file header (30 bytes + name length)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHeader.writeUInt16LE(20, 4); // Version needed (2.0)
    localHeader.writeUInt16LE(0, 6); // General purpose bit flag
    localHeader.writeUInt16LE(8, 8); // Compression method: Deflated
    localHeader.writeUInt16LE(0, 10); // Last mod time
    localHeader.writeUInt16LE(0, 12); // Last mod date
    localHeader.writeUInt32LE(fileCrc, 14); // CRC32
    localHeader.writeUInt32LE(compressedSize, 18); // Compressed size
    localHeader.writeUInt32LE(uncompressedSize, 22); // Uncompressed size
    localHeader.writeUInt16LE(fileNameBuf.length, 26); // Filename length
    localHeader.writeUInt16LE(0, 28); // Extra field length

    chunks.push(localHeader, fileNameBuf, compressedData);

    fileRecords.push({
      nameBuf: fileNameBuf,
      crc: fileCrc,
      compressedSize,
      uncompressedSize,
      offset,
    });

    offset += 30 + fileNameBuf.length + compressedSize;
  }

  // Central directory
  const centralDirStart = offset;
  let centralDirSize = 0;

  for (const rec of fileRecords) {
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0); // Central file header signature
    cdHeader.writeUInt16LE(20, 4); // Version made by
    cdHeader.writeUInt16LE(20, 6); // Version needed
    cdHeader.writeUInt16LE(0, 8); // Flags
    cdHeader.writeUInt16LE(8, 10); // Compression
    cdHeader.writeUInt16LE(0, 12); // Time
    cdHeader.writeUInt16LE(0, 14); // Date
    cdHeader.writeUInt32LE(rec.crc, 16);
    cdHeader.writeUInt32LE(rec.compressedSize, 20);
    cdHeader.writeUInt32LE(rec.uncompressedSize, 24);
    cdHeader.writeUInt16LE(rec.nameBuf.length, 28);
    cdHeader.writeUInt16LE(0, 30); // Extra field len
    cdHeader.writeUInt16LE(0, 32); // Comment len
    cdHeader.writeUInt16LE(0, 34); // Disk start
    cdHeader.writeUInt16LE(0, 36); // Internal attributes
    cdHeader.writeUInt32LE(0, 38); // External attributes
    cdHeader.writeUInt32LE(rec.offset, 42); // Relative offset

    chunks.push(cdHeader, rec.nameBuf);
    centralDirSize += 46 + rec.nameBuf.length;
  }

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // Disk number
  eocd.writeUInt16LE(0, 6); // Disk with CD
  eocd.writeUInt16LE(fileRecords.length, 8); // Records on disk
  eocd.writeUInt16LE(fileRecords.length, 10); // Total records
  eocd.writeUInt32LE(centralDirSize, 12); // CD size
  eocd.writeUInt32LE(centralDirStart, 16); // CD offset
  eocd.writeUInt16LE(0, 20); // Comment len

  chunks.push(eocd);

  const finalZip = Buffer.concat(chunks);
  fs.writeFileSync(outputPath, finalZip);
  console.log(`ZIP created successfully at ${outputPath} (${finalZip.length} bytes)`);
}

// Gather all source files
const filesToZip = [];
function walk(dir, baseDir = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.aistudio'].includes(entry.name)) continue;
      walk(fullPath, relPath);
    } else {
      if (entry.name.endsWith('.zip')) continue;
      filesToZip.push({
        name: relPath.replace(/\\/g, '/'),
        content: fs.readFileSync(fullPath),
      });
    }
  }
}

walk(process.cwd());
createZip(filesToZip, path.join(process.cwd(), 'public', 'my-fitness-tracker.zip'));
