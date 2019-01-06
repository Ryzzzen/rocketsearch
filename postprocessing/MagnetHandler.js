const magnet = require('magnet-uri');
const utils = require('../utils');

class MagnetHandler {

  handle(doc) {
    console.log('=> Checking magnet:', doc.meta.infoHash);

    const parsed = magnet.decode(doc.links.magnet);

    doc.id = parsed.infoHash || doc.meta.infoHash || doc.links.web[0];
    doc.title = doc.title || parsed.name;

    doc.meta.infoHash = parsed.infoHash || doc.meta.infoHash;

    if (utils.isValidSHA1(doc.meta.infoHash))
      return doc;
    else return null;
  }
}

module.exports = MagnetHandler;
