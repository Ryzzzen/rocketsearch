const json = require('../utils').json;

class Provider {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.state = 'STARTING';

    this.meta = {
      reloadTime: 3600000
    };
  }

  async _loadConfigFile() {
    console.log(`[${this.name}] Loading config file`);

    let file = await json.loadFile(`./data/${this.id}.json`);
    console.dir(file);

    if (!Object.keys(file).length) await json.saveFile(`./data/${this.id}.json`, this.meta);
    else this.meta = file;
  }

  async load() {
    console.log(`[${this.name}] Loading`);
    await this._loadConfigFile();

    return true;
  }

  async stop() {}
}

module.exports = Provider;
