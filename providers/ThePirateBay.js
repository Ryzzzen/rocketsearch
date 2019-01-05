const Provider = require('./');

let Parser = require('rss-parser');
let parser = new Parser({
  customFields: {
    item: ['torrent'],
  }
});

class ThePirateBay extends Provider {
  constructor() {
    super('thepiratebay', 'The Pirate Bay');

    this.meta.website = 'https://pirateproxy.app/';
    this.meta.rssfeeds = [
      'https://pirateproxy.app/rss//top100/100',
      'https://pirateproxy.app/rss//top100/200',
      'https://pirateproxy.app/rss//top100/300',
      'https://pirateproxy.app/rss//top100/400',
      'https://pirateproxy.app/rss//top100/500',
      'https://pirateproxy.app/rss//top100/600'
    ];

    this.meta.types = {
      'Applications': 100
    };

    this.meta.subtypes = {
      'Windows': 100100
    };

    this.meta.categories = {
      'Audio / Music': 200000
    }
  }

  async load() {
    super.load();
    return true;
  }

  /*
  * Reads multiple RSS feeds, uses object to remove duplicates, then creates and return data that rocketsearch can read.
  */
  async getTopTorrents() {
    let self = this, data = {};

    for (let i = 0; i < 1/*this.meta.rssfeeds.length*/; i++) {
      await require('../utils').sleep(1000);

      console.log(`[${this.name}] Reading feed from URL ${this.meta.rssfeeds[i]}`);
      let feed = await parser.parseURL(this.meta.rssfeeds[i]);

      let d = feed.items.map(x => {
        return {
          id: x.torrent.infoHash[0],
          title: x.title,
          links: { download: [x.link], magnet: x.torrent.magnetURI, web: [x.guid.slice(24)] },
          author: x.creator,
          uploadDate: Date.parse(x.isoDate),
          categories: x.categories.map(x => self.meta.categories[x._] || x._),
          meta: {
            infoHash: x.torrent.infoHash[0],
            size: x.torrent.contentLength[0],
            providedBy: self.id,
            trackerType: 0 /* TPB is a public tracker */
          }
        };
      });

      for (let ii = 0; ii < d.length; ii++)
        data[d[ii].links.web] = d[ii];
    }

    return Object.values(data);
  }
}

module.exports = ThePirateBay;
