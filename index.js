const TPB = require('./providers/ThePirateBay');
const Rocketsearch = new (require('./Rocketsearch'))(require('./config.json'));

(async () => {
  await Rocketsearch.load();

  let instance = new TPB();

  await instance.load();
  let data = await instance.search('test');

  console.dir(data);
  data[0] = data[0].map(x => Rocketsearch._magnetHandler.handle(x));
  console.dir(data);

  Rocketsearch._dataManager.insertEntries(data[0]);
})();
