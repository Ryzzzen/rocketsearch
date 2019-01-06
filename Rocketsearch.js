const r = require('rethinkdb');

class Rocketsearch {
  constructor(conf) {
    this._config = conf;
  }

  async load() {
    console.log('[System] Loading!');

    console.log('=> Connecting to database');
    this.conn = await r.connect({
      host: this._config.rethinkdb_host,
      port: this._config.rethinkdb_port,
      db: this._config.rethinkdb_db,
      user: this._config.rethinkdb_user,
      password: this._config.rethinkdb_pass,
    });

    this._dataManager = new (require('./postprocessing/DataManager'))(this.conn);
    this._importManager = new (require('./postprocessing/ImportManager'))();

    this._magnetHandler = new (require('./postprocessing/MagnetHandler'))();
    this._torrentHandler = new (require('./postprocessing/TorrentHandler'))();

    await this._torrentHandler.load();
    await this._importManager.load(this);
  }

  async stop() {
    console.log('[System] Shutting down!');

    try {
      console.log('=> Closing database');
      await this.db.close();
    }
    catch(err) {
      console.log('[System] Something prevented a correct shutdown!');
      console.error(err);
    }
  }
}

module.exports = Rocketsearch;
