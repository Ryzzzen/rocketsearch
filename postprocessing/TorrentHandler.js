const fs = require('fs'), path = require('path');
const utils = require('../utils');

class TorrentHandler {
  async load() {
    await utils._ensureDir(path.join(__dirname, '../cache'));
    await utils._ensureDir(path.join(__dirname, '../cache/torrents'));
  }

  write(stream) {
    return fs.createWriteStream(path.join(__dirname, '../cache/torrents')).pipe(stream);
  }
}

module.exports = TorrentHandler;
