const { format } = require('util')
const bent = require('bent')
const core = require('@actions/core');
const semver = require('semver');

const getJSON = bent('json')

const REDIRECT_CODES = [301, 302, 303, 307, 308]

module.exports = class AbstractRegistry {
  constructor() {
    this.registry = null
  }

  /**
   * Download a remote file e.g. json from a registry for a given package and return it.
   *
   * @param {object} options
   * @param {string} [options.package=''] Provide a package name to search for.
   * @param {string} [options.type='json'] Remote registry response type.
   *
   * @returns {object}
   */
  async download(options = { package: '', type: 'json' }) {
    if (!this.registry) {
      throw new Error('Property "registry" is empty!')
    }

    if (!options.package) {
      throw new Error('No target package provided!')
    }

    const url = format(this.registry, options.package)
    core.debug(`Download url: "${url}"`);
    core.debug(`Download type: "${options.type}"`);

    switch (options.type) {
      case 'json':
        return await this._getJson(url)
      
      default:
        throw new Error(`Unsopported download type "${options.type}"!`)
    }
  }

  /**
   * Load a remote json ressource and handle redirects.
   *
   * @param {string} url
   * @param {number} [redirects=20] Maximum amount of redirects.
   *
   * @returns {Promise}
   */
  async _getJson(url, redirects = 20) {
    if (redirects <= 0) {
      throw new Error('Max redirects reached!')
    }

    try {
      return await getJSON(url)
    } catch (ex) {
      if (REDIRECT_CODES.indexOf(ex.statusCode) !== -1) {
        return await this._getJson(ex.headers.location, redirects - 1)
      }

      throw ex
    }
  }

  /**
   * Get latest package version from remote registry.
   * 
   * @param {object} options
   * @param {string} [options.package=''] Provide a package name to search for.
   * @param {string} [options.type=''] Remote registry response type.
   * @param {object} [options.conditions=''] Additional filter conditions. Passed one condition per line
   */
  async getLatestVersion(options = { package: '', type: '', conditions: '' }) { // eslint-disable-line no-unused-vars
    throw new Error('Method not implemented!')
  }

  /**
   * Clean up a semantic version and return it.
   *
   * @param {string} version
   *
   * @returns {string}
   */
  cleanSemver(version) {
    return semver.clean(version, { loose: true, includePrerelease: true }) || semver.valid(semver.coerce(version))
  }

  /**
   * Check if a version is loosly valid.
   *
   * @param {string} version
   */
  isLooslyValidVersion(version) {
    if (!version) {
      return false
    }

    if (!(/^(v|\d)/i.test(version))) {
      return false
    }

    return this.cleanSemver(version) !== null
  }

  /**
   *
   * @param {string} conditionsString
   *
   * @returns {object}
   */
  _prepareConditions(conditionsString) {
    const result = {}

    if (!(conditionsString && typeof conditionsString === 'string')) {
      return result
    }

    for (let line of conditionsString.split(/\r\n|\r|\n/g)) {
      const matches = line.trim().match(/^(.*):\s*(.*)$/)

      if (matches && matches.length > 0) {
        result[matches[1]] = matches[2]
      }
    }

    return result
  }

  /**
   * 
   * @param {object} versions
   *
   * @returns {object}
   */
  _sortVersions(versions) {
    return Object.keys(versions)
      .sort((a, b) => semver.rcompare(a, b))
      .reduce((result, key) => {
        result.push(versions[key])
        return result
      }, [])
  }
}
