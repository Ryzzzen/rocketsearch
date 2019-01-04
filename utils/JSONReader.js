const fs = require('fs');
class JSONReader {
  loadFile(path, returnEmptyFileOnParseError = true) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
          if (err && err.code !== 'ENOENT') return reject(err);

          try {
            resolve(JSON.parse(data || {}));
          }
          catch(err) {
            if (returnEmptyFileOnParseError) resolve({});
            else reject(err);
          }
      });
    });
  }

  saveFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), 'utf8', err => {
        if (err) reject(err);
      });
    });
  }
}

module.exports = JSONReader;
