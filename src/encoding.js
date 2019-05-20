const encode = data =>
  Buffer.from(JSON.stringify(data, 'utf8')).toString('base64')

module.exports.encode = encode

const unencode = data => JSON.parse(Buffer.from(data, 'base64').toString())

module.exports.unencode = unencode
