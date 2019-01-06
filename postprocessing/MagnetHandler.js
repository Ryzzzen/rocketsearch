const magnet = require('magnet-uri');

class MagnetHandler {

   handle(doc) {
    console.log('=> Checking magnet:', doc.links.magnet);

    const parsed = magnet.decode(doc.links.magnet);
    doc.id = parsed.infoHash || doc.links.web[0];

    return doc;
  }
}

module.exports = MagnetHandler;
