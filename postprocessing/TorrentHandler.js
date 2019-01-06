const fs = require('fs'), path = require('path');
const parseTorrent = require('parse-torrent');

const utils = require('../utils');

class TorrentHandler {
  async load() {
    await utils._ensureDir(path.join(__dirname, '../cache'));
    await utils._ensureDir(path.join(__dirname, '../cache/torrents'));
  }

  async handle(doc, stream) {
    const parsed = parseTorrent(await this._streamToBuffer(stream));
    console.log('=> Checking torrent:', parsed.infoHash);

    doc.meta.infoHash = doc.meta.infoHash || parsed.infoHash;

    doc.uploadDate = Date.parse(parsed.created);

    doc.title = doc.title || parsed.name;
    doc.description = doc.description || parsed.comment || 'There is no description for this torrent.';
    doc.meta.size = doc.meta.size || parsed.files && parsed.files.length > 0 ? parsed.files.reduce((acc, file) => acc + file.length) : 0;

    doc.links.magnet = doc.links.magnet || parseTorrent.toMagnetURI(parsed);
  }

  _streamToBuffer(stream) {
    console.log('=> Converting torrent stream to a buffer');

    return new Promise((resolve, reject) => {
      let buffers = [];

      stream
      .on('data', buffer => buffers.push(buffer))
      .on('error', err => reject(err))
      .on('end', () => resolve(Buffer.concat(buffers)));
    })
  }
}

module.exports = TorrentHandler;
