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
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms))
}
