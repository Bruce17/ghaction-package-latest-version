const process = require('process');
const cp = require('child_process');
const path = require('path');

describe('index.js', () => {
  // shows how the runner will run a javascript action with env / stdout protocol
  xtest('test runs', () => {
    process.env['INPUT_PACKAGE'] = 'flask'
    process.env['INPUT_LANGUAGE'] = 'python'

    // TODO: think about mocking the actual backend request

    const ip = path.join(__dirname, '../src/index.js')
    console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString())
  })
})
