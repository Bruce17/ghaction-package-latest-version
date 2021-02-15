const NodeRegistry = require('./node-registry')
const PythonRegistry = require('./python-registry')

module.exports = class RegistryFactory {
  /**
   * Get a registry for a specific language.
   *
   * @param {string} language
   *
   * @returns {AbstractRegistry} It will return a new registry instance every time and does not use the singleton pattern. Reason: a user might want to use multiple registries for one language with different backend urls.
   * 
   * @throws {Error} If no registry is implemented for target language.
   */
  static getRegistry(language) {
    if (typeof language !== 'string') {
      throw new TypeError('Argument "language" is not of type "string"!')
    }

    switch (language.toLowerCase()) {
      case 'python':
        return new PythonRegistry()
  
      case 'node':
        return new NodeRegistry()

      default:
        throw new Error(`Not implemented for language "${language}"!`)
    }
  }
}
