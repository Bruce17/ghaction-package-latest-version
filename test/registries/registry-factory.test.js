const NodeRegistry = require('../../src/registries/node-registry')
const PythonRegistry = require('../../src/registries/python-registry')
const RegistryFactory = require('../../src/registries/registry-factory')

describe('RegistryFactory', () => {
  test('class exists', () => {
    expect(typeof RegistryFactory).toBe('function')
  })

  describe('getRegistry', () => {
    test('method exists', () => {
      expect(typeof RegistryFactory.getRegistry).toBe('function')
    })

    describe('invalid language argument', () => {
      const testData = [
        { language: undefined },
        { language: null },
        { language: {} },
        { language: [] },
        { language: true },
        { language: false },
        { language: 123 },
      ]

      for (let obj of testData) {
        test(`throws for language "${obj.language}"`, () => {
          expect(() => {
            RegistryFactory.getRegistry(obj.language)
          }).toThrowError(/argument "language" is not of type "string"!/i)
        })
      }
    })

    describe('invalid registries', () => {
      const testData = [
        { language: '' },
        { language: 'foo' },
      ]

      for (let obj of testData) {
        test(`throws for language "${obj.language}"`, () => {
          expect(() => {
            RegistryFactory.getRegistry(obj.language)
          }).toThrowError(/not implemented/i)
        })
      }
    })

    describe('is valid registries', () => {
      const testData = [
        { language: 'python', expected: PythonRegistry },
        { language: 'Python', expected: PythonRegistry },
        { language: 'node',   expected: NodeRegistry },
        { language: 'Node',   expected: NodeRegistry },
      ]

      for (let obj of testData) {
        test(`returns registry for language "${obj.language}"`, () => {
          const result = RegistryFactory.getRegistry(obj.language)

          expect(result).toBeDefined()
          expect(result).toBeInstanceOf(obj.expected)
        })
      }
    })
  })
})
