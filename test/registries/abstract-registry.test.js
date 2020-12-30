const AbstractRegistry = require('../../src/registries/abstract-registry')

describe('AbstractRegistry', () => {
  const inst = new AbstractRegistry()

  test('class exists', () => {
    expect(typeof AbstractRegistry).toBe('function')
    expect(typeof inst).toBe('object')
  })

  describe('cleanSemver', () => {
    test('method exists', () => {
      expect(typeof inst.cleanSemver).toBe('function')
    })
    
    describe('is valid', () => {
      const testData = {
        '1': '1.0.0',
        '1.0': '1.0.0',
        '1.0.0': '1.0.0',
        '1a': '1.0.0',
        '1.0a': '1.0.0',
        '1.0.0a': '1.0.0-a',
        '1ab': '1.0.0',
        '1.0ab': '1.0.0',
        '1.0.0ab': '1.0.0-ab',
    
        'v1': '1.0.0',
        'v1.0': '1.0.0',
        'v1.0.0': '1.0.0',
        'v1a': '1.0.0',
        'v1.0a': '1.0.0',
        'v1.0.0a': '1.0.0-a',
        'v1ab': '1.0.0',
        'v1.0ab': '1.0.0',
        'v1.0.0ab': '1.0.0-ab',
      }
    
      for (let [input, expected] of Object.entries(testData)) {
        test(`for input "${input}" to be "${expected}"`, () => {
          expect(inst.cleanSemver(input)).toBe(expected)
        })
      }
    })
  })

  describe('isLooslyValidVersion', () => {
    test('method exists', () => {
      expect(typeof inst.isLooslyValidVersion).toBe('function')
    })
  
    describe('is valid', () => {
      const testData = {
        '1': true,
        '1.0': true,
        '1.0.0': true,
        '1a': true,
        '1.0a': true,
        '1.0.0a': true,
        '1ab': true,
        '1.0ab': true,
        '1.0.0ab': true,
  
        'v1': true,
        'v1.0': true,
        'v1.0.0': true,
        'v1a': true,
        'v1.0a': true,
        'v1.0.0a': true,
        'v1ab': true,
        'v1.0ab': true,
        'v1.0.0ab': true,
      }
  
      for (let [input, expected] of Object.entries(testData)) {
        test(`for input "${input}"`, () => {
          expect(inst.isLooslyValidVersion(input)).toBe(expected)
        })
      }
    })
  })
  
  describe('is invalid', () => {
    const testData = {
      'p1': false,
      'py2': false,
      'py3': false,
    }

    for (let [input, expected] of Object.entries(testData)) {
      test(`for input "${input}"`, () => {
        expect(inst.isLooslyValidVersion(input)).toBe(expected)
      })
    }
  })
  
  describe('getLatestVersion', () => {
    test('method exists', () => {
      expect(typeof inst.getLatestVersion).toBe('function')
    })
  
    test('to throw "not implemented"', async () => {
      await expect(inst.getLatestVersion()).rejects.toThrowError(/not implemented/i)
    })
  })

  describe('_prepareConditions', () => {
    test('method exists', () => {
      expect(typeof inst._prepareConditions).toBe('function')
    })

    describe('is invalid', () => {
      const testData = [
        undefined,
        null,
        true,
        false,
        {},
        [],
        123,
      ]
  
      for (let input of testData) {
        test(`for input "${input}"`, () => {
          expect(inst._prepareConditions(input)).toStrictEqual({})
        })
      }
    })

    describe('is valid', () => {
      const testData = {
        '': {},

        'foo:bar': {foo: 'bar'},
        'foo: bar': {foo: 'bar'},

        'foo: bar\nnum: 123': {foo: 'bar', num: '123'},
        'foo: bar\rnum: 123': {foo: 'bar', num: '123'},
        'foo: bar\r\nnum: 123': {foo: 'bar', num: '123'},

        'foo:bar\nnum:123': {foo: 'bar', num: '123'},
        'foo:bar\rnum:123': {foo: 'bar', num: '123'},
        'foo:bar\r\nnum:123': {foo: 'bar', num: '123'},

        'foo: bar\nnum: 123\nbool: true': {foo: 'bar', num: '123', bool: 'true'},
        'foo: bar\rnum: 123\rbool: true': {foo: 'bar', num: '123', bool: 'true'},
        'foo: bar\r\nnum: 123\r\nbool: true': {foo: 'bar', num: '123', bool: 'true'},

        'foo:bar\nnum:123\nbool:true': {foo: 'bar', num: '123', bool: 'true'},
        'foo:bar\rnum:123\rbool:true': {foo: 'bar', num: '123', bool: 'true'},
        'foo:bar\r\nnum:123\r\nbool:true': {foo: 'bar', num: '123', bool: 'true'},
      }
  
      for (let [input, expected] of Object.entries(testData)) {
        test(`for input "${input}"`, () => {
          expect(inst._prepareConditions(input)).toStrictEqual(expected)
        })
      }
    })
  })
})
