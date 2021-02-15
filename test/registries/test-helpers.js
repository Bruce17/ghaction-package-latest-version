const fs = require('fs')
const path = require('path')

module.exports.mockDownload = (baseRegistry) => {
  return jest.fn((opt) => {
    if (!opt.type) {
      throw new TypeError(`Download method: unsupported value "${opt.type}" for option "type"!`)
    }

    const pkg = opt.package.replace('/', '-')

    return JSON.parse(fs.readFileSync(path.resolve(__dirname + `/../files/${baseRegistry}-${pkg}.json`)))
  })
}
