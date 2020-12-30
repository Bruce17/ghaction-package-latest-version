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

    describe('invalid registries', () => {
      const testData = [
        { language: undefined },
        { language: null },
        { language: {} },
        { language: [] },
        { language: true },
        { language: false },
        { language: '' },
        { language: 123 },
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
        { language: 'python' },
        { language: 'Python' },
      ]

      for (let obj of testData) {
        test(`returns registry for language "${obj.language}"`, () => {
          const result = RegistryFactory.getRegistry(obj.language)

          expect(result).toBeDefined()
          expect(result).toBeInstanceOf(PythonRegistry)
        })
      }
    })
  })
})
