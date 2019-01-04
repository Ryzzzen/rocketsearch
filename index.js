const TPB = require('./providers/ThePirateBay');

let instance = new TPB();
console.dir(instance);

instance.load().then(x => {
  instance.run().then(console.dir);
});
