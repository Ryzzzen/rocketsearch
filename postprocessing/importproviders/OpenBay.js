const fs = require('fs'), path = require('path');

const categories = {
  anime: 500400,
  softwares: 100000,
  software: 100000,
  games: 110000,
  adult: 500300,
  movies: 500200,
  other: 0,
  music: 200000,
  'series & tv': 500100,
  books: 300000
};

module.exports = function(filePath, handle) {
  let data = [], i = 0;
  const lineReader = require('readline').createInterface({
    input: fs.createReadStream(filePath)
  });

  lineReader.on('line', line => {
    let d = line.split('|');
    if (d.length < 5) return;

    console.log(`=> Reading ${d[0]} (${d[2]}) from OpenBay archive`);

    let matches = /"(.*?)"/g.exec(d[0]), title = matches !== null && matches.length === 2 ? matches[1] : d[0];
    data.push({
      title: title,
      id: d[2],
      links: {
        download: [],
        magnet: `magnet:?xt=urn:btih:${d[2]}&dn=${encodeURIComponent(title)}&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopentor.org%3A2710&tr=udp%3A%2F%2Ftracker.ccc.de%3A80&tr=udp%3A%2F%2Ftracker.blackunicorn.xyz%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969`,
        web: []
      },
      categories: [categories[d[4].replace(/\"/g, '')] || d[4].replace(/\"/g, '')],
      meta: {
        infoHash: d[2],
        size: d[1],
        providedBy: 'openbay',
        popularity: d[3],
        seeders: d[5] || 0,
        leechers: d[6] || 0,
        trackerType: 0
      }
    });

    i++;

    if (i === 100) {
      lineReader.pause();
      handle(data).then(() => {
        data = [];
        i = 0;

        console.log(`=> Resumed reading OpenBay archive`);
        lineReader.resume();
      });
    }
  }).on('close', () => handle(data));
}
