const r = require('rethinkdb');

class DataManager {
  constructor(conn) {
    this.conn = conn;
  }

  async insertEntries(arr) {
    if (arr.length < 1) return;

    const d = await r.table('download_records').insert(arr, { conflict: this.resolveConflicts }).run(this.conn);
    console.log(`[DataManager] Inserted ${d.inserted} records`);
  }

  /*
  * Resolves conflicts between two documents
  */
  resolveConflicts(id, oldDoc, newDoc) {
    console.dir(oldDoc);

    if (oldDoc.links) {
      if (!oldDoc.links.download.includes(newDoc.links.download[0]))
        oldDoc.links.download.push(newDoc.links.download[0]);

      if (!oldDoc.links.magnet.includes(newDoc.links.magnet[0]))
        oldDoc.links.magnet.push(newDoc.links.magnet[0]);

      if (!oldDoc.links.web.includes(newDoc.links.web[0]))
        oldDoc.links.web.push(newDoc.links.web[0]);

      return oldDoc;
    }
    else return newDoc;
  }
}

module.exports = DataManager;
