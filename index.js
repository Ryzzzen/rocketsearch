const TPB = require('./providers/ThePirateBay');
const Rocketsearch = new (require('./Rocketsearch'))(require('./config.json'));

(async () => {
  await Rocketsearch.load();

  let instance = new TPB();

  await instance.load();
  let torrents = await instance.getTopTorrents();

  console.dir(torrents);

  Rocketsearch._dataManager.insertEntries(torrents);
})();
