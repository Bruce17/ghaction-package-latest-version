const semver = require('semver');
const AbstractRegistry = require('./abstract-registry');

module.exports = class NodeRegistry extends AbstractRegistry {
  constructor() {
    super()

    this.registry = 'https://registry.npmjs.com/%s'
  }

  /**
   * @inheritdoc
   */
  async getLatestVersion(options = { package: '', type: 'json', conditions: '' }) {
    const json = await this.download({ package: options.package, type: options.type || 'json' })
    const versions = this._prepareVersions(json)
    let filteredVersions = this._sortVersions(versions)

    const conditions = this._prepareConditions(options.conditions)

    if (conditions) {
      if (conditions.node) {
        filteredVersions = this._filterByNodeVersion(conditions, 'node', filteredVersions)
      }

      if (conditions.iojs) {
        filteredVersions = this._filterByNodeVersion(conditions, 'iojs', filteredVersions)
      }
    }

    const firstKey = Object.keys(filteredVersions)[0]

    return (firstKey && filteredVersions[firstKey].length > 0 ? filteredVersions[firstKey][0].originalVersion : null)
  }

  /**
   * 
   * @param {object} json
   *
   * @returns {object}
   */
  _prepareVersions(json) {
    const versions = {}

    for (let [version, obj] of Object.entries(json.versions)) {
      const cleanedVersion = this.cleanSemver(version)

      versions[cleanedVersion] = [
        {
          nodeVersion: obj.engines,
          cleanedVersion: cleanedVersion,
          originalVersion: version
        }
      ]
    }

    return versions
  }

  /**
   *
   * @param {object} condition
   * @param {string} conditionKey
   * @param {array} filteredVersions
   *
   * @returns {array}
   */
  _filterByNodeVersion(condition, conditionKey, filteredVersions) {
    const nodeVersionCleaned = this.cleanSemver(condition[conditionKey])

    const filterMethod = (val) => {
      for (let obj of Object.values(val)) {
        if (!obj.nodeVersion || !obj.nodeVersion[conditionKey] || obj.nodeVersion[conditionKey].length === 0) {
          continue
        }

        return semver.satisfies(nodeVersionCleaned, obj.nodeVersion[conditionKey])
      }

      return false
    }

    const result = filteredVersions.filter(filterMethod)

    // If nothting is found, take the latest one where node==null
    if (result.length === 0) {
      filteredVersions = filteredVersions.filter((val) => {
        for (let obj of Object.values(val)) {
          if (!obj.nodeVersion[conditionKey] || obj.nodeVersion[conditionKey] === null) {
            return true
          }
        }

        return false
      })
    } else {
      filteredVersions = result
    }

    return filteredVersions
  }
}
