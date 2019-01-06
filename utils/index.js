module.exports = {
  json: new (require('./JSONReader.js'))(),
  _ensureDir: path => {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.mkdir(path, function(err) {
        if (err) {
          if (err.code === 'EEXIST') resolve();
          else reject(err);
        }
        else resolve();
      });
    });
  },
  isValidSHA1: s => /^[a-fA-F0-9]{40}$/g.test(s),
  isValidMD5: s => /^[a-fA-F0-9]{32}$/g.test(s),
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms))
}
