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
    switch (language) {
      case 'python':
      case 'Python':
        return new PythonRegistry()

      default:
        throw new Error(`Not implemented for language "${language}"!`)
    }
  }
}
