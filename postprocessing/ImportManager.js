const fs = require('fs'), path = require('path');
var chokidar = require('chokidar');

const utils = require('../utils');

class ImportManager {
  async load(Rocketsearch) {
    await utils._ensureDir(path.join(__dirname, '../cache'));
    await utils._ensureDir(path.join(__dirname, '../cache/imports'));

    this._watcher = chokidar.watch(path.join(__dirname, '../cache/imports'))
    .on('add', path => this.handleImport(Rocketsearch, path))
    .on('change', path => this.handleImport(Rocketsearch, path));
  }

  async handleImport(Rocketsearch, filePath) {
    console.log(filePath);

    if (path.extname(filePath) === '.openbay') require('./importproviders/OpenBay')(filePath, docs => Rocketsearch._dataManager.insertEntries(docs.map(x => Rocketsearch._magnetHandler.handle(x))));
    else console.log('=> Import failed because of unknown extension:', filePath);
  }

  async stop() {

  }
}

module.exports = ImportManager;
