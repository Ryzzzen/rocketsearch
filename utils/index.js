module.exports = {
  json: new (require('./JSONReader.js'))(),
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms))
}
