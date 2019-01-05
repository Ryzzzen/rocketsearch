const Provider = require('./');

const RSSParser = require('rss-parser');
const rp = require('request-promise'), cheerio = require('cheerio');

let parser = new RSSParser({
  customFields: {
    item: ['torrent'],
  }
});

class ThePirateBay extends Provider {
  constructor() {
    super('thepiratebay', 'The Pirate Bay');

    this.meta.website = 'https://pirateproxy.app';
    this.meta.rssfeeds = [
      '/rss/top100/100',
      '/rss/top100/200',
      '/rss/top100/300',
      '/rss/top100/400',
      '/rss/top100/500',
      '/rss/top100/600'
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

    this.meta.search = '/search/%s/%n/99/600';
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
      let feed = await parser.parseURL(this.meta.website + this.meta.rssfeeds[i]);

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

  /*
  * Searches and saves into data that is readable by rocketsearch
  */
  async search(q, page = 1) {
    if (!q || q.length === 0) throw Error('Query is empty');
    const self = this;

    let $ = await rp({
      uri: this.meta.website + this.meta.search.replace('%s', q).replace('%n', page),
      transform: body => cheerio.load(body)
    });

    let results = [];
    $('#searchResult tbody tr:has(td.vertTh)').each(function(index) {
      let data = { links: {}, meta: { providedBy: self.id, trackerType: 0 } };

      $(this).children().each(function(index) {
        if (index === 0) data.category = [$(this).text().replace(/\s/g, '').replace('(', ' / ').slice(0, -1)].map(x => self.meta.categories[x] || x);
        else if (index === 1) {
          $(this).children().each(function(index) {
            if (index === 0) {
              data.links.download = $(this).find('a').prop('href');
              data.title = $(this).text().trim();
            }
            else if (index === 1) data.id = data.links.magnet = $(this).attr('href');
            else if (index === 4) {
              let x = $(this).text().trim().split(', ').map((x, index) => x.split(' ')[index === 2 ? 2 : 1]);

              data.meta.uploadDate = Date.parse(x[0].replace(/[\s,-]/g, '/')) || x[0].replace(/[\s,-]/g, '/');
              data.meta.size = x[1];
              data.author = x[2];
            }
          });
        }
      });

      results.push(data);
    });

    const pages = [];
    $('#searchResult > tbody > tr:nth-child(31) > td').children().slice(1, -1).each(function(index) {
      pages.push($(this).text());
    });

    return [results, pages];
  }
}

module.exports = ThePirateBay;
