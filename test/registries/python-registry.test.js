const fs = require('fs')
const path = require('path')
const PythonRegistry = require('../../src/registries/python-registry')

describe('PythonRegistry', () => {
  const inst = new PythonRegistry()

  // Mock the download method to not hit the internet
  inst.download = jest.fn(() => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../files/pypi-flask.json')))
  })

  test('class exists', () => {
    expect(typeof PythonRegistry).toBe('function')
    expect(typeof inst).toBe('object')
  })

  describe('getLatestVersion', () => {
    test('method exists', () => {
      expect(typeof inst.getLatestVersion).toBe('function')
    })

    describe('is valid', () => {
      const testData = [
        {
          input: {
            package: 'flask',
            conditions: 'pythonVersion: py3',
          },
          expected: '1.1.2'
        },
        {
          input: {
            package: 'flask',
            conditions: 'pythonVersion: python3',
          },
          expected: '1.1.2'
        },
        {
          input: {
            package: 'flask',
            conditions: 'pythonVersion: py2',
          },
          expected: '1.1.2'
        },
        {
          input: {
            package: 'flask',
            conditions: 'pythonVersion: python2',
          },
          expected: '1.1.2'
        },
        {
          input: {
            package: 'flask',
            conditions: 'pythonVersion: 2.7',
          },
          expected: '0.12.2'
        },
        {
          input: {
            package: 'flask',
            conditions: 'requiresPython: 2.5',
          },
          expected: '1.0.3'
        },
        {
          input: {
            package: 'flask',
            conditions: 'requiresPython: 2.7',
          },
          expected: '1.1.2'
        },
      ]
  
      for (let data of testData) {
        test(`for conditions "${JSON.stringify(data.input.conditions)}"`, async () => {
          expect(await inst.getLatestVersion(data.input)).toBe(data.expected)
        })
      }
    })
  })
})
