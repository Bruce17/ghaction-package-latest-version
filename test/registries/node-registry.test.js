const NodeRegistry = require('../../src/registries/node-registry')
const { mockDownload } = require('./test-helpers')

describe('NodeRegistry', () => {
  const inst = new NodeRegistry()

  // Mock the download method to not hit the internet
  inst.download = mockDownload('npm')

  test('class exists', () => {
    expect(typeof NodeRegistry).toBe('function')
    expect(typeof inst).toBe('object')
  })

  describe('getLatestVersion', () => {
    test('method exists', () => {
      expect(typeof inst.getLatestVersion).toBe('function')
    })

    describe('is valid', () => {
      const testData = [
        // Package "safe-compare"
        {
          input: {
            package: 'safe-compare',
          },
          expected: '1.1.4'
        },

        // Package "@bruce17/dependable"
        {
          input: {
            package: '@bruce17/dependable',
          },
          expected: '1.3.1'
        },

        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.8'
          },
          expected: null
        },
        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.8.0'
          },
          expected: null
        },

        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'iojs: >=1'
          },
          expected: '1.3.1'
        },
        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'iojs: >=1.0'
          },
          expected: '1.3.1'
        },
        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'iojs: >=1.0.0'
          },
          expected: '1.3.1'
        },

        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.10\niojs: >=1'
          },
          expected: '1.3.1'
        },
        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.10.0\niojs: >=1'
          },
          expected: '1.3.1'
        },

        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.10\niojs: >=1.0'
          },
          expected: '1.3.1'
        },
        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.10.0\niojs: >=1.0'
          },
          expected: '1.3.1'
        },

        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.10\niojs: >=1.0.0'
          },
          expected: '1.3.1'
        },
        {
          input: {
            package: '@bruce17/dependable',
            conditions: 'node: >=0.10.0\niojs: >=1'
          },
          expected: '1.3.1'
        },

        // Package "eslint"
        {
          input: {
            package: 'eslint',
          },
          expected: '7.20.0'
        },
        {
          input: {
            package: 'eslint',
            conditions: 'node: ^8.10.0'
          },
          expected: '6.2.0'
        },
        {
          input: {
            package: 'eslint',
            conditions: 'node: ^8.10.0 || ^10.13.0'
          },
          expected: '6.2.0'
        },
        {
          input: {
            package: 'eslint',
            conditions: 'node: ^8.10.0 || ^10.13.0 || >=11.10.1'
          },
          expected: '6.2.0'
        },
        {
          input: {
            package: 'eslint',
            conditions: 'node: >=0.10'
          },
          expected: '0.6.0'
        },
      ]
  
      for (let data of testData) {
        let testName = `for package "${data.input.package}"`

        if (data.input.conditions) {
          testName += ` with conditions "${JSON.stringify(data.input.conditions)}"`
        }

        test(testName, async () => {
          expect(await inst.getLatestVersion(data.input)).toBe(data.expected)
        })
      }
    })
  })
})
