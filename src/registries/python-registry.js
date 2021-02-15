const semver = require('semver');
const AbstractRegistry = require('./abstract-registry');

module.exports = class PythonRegistry extends AbstractRegistry {
  constructor() {
    super()

    this.registry = 'https://pypi.org/pypi/%s/json'
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
      if (conditions.pythonVersion) {
        filteredVersions = this._filterByPythonVersion(conditions, filteredVersions)
      }
  
      if (conditions.requiresPython) {
        filteredVersions = this._filterByRequiresPython(conditions, filteredVersions)
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

    for (let [version, obj] of Object.entries(json.releases)) {
      const cleanedVersion = this.cleanSemver(version)

      versions[cleanedVersion] = []

      for (let details of obj) {
        versions[cleanedVersion].push({
          pythonVersion: details.python_version,
          requiresPython: details.requires_python,
          cleanedVersion: cleanedVersion,
          originalVersion: version
        })
      }
    }

    return versions
  }

  /**
   *
   * @param {object} conditions
   * @param {array} filteredVersions
   *
   * @returns {array}
   */
  _filterByPythonVersion(conditions, filteredVersions) {
    let filterMethod

    if (this.isLooslyValidVersion(conditions.pythonVersion)) {
      filterMethod = (val) => {
        for (let obj of Object.values(val)) {
          if (obj.pythonVersion === conditions.pythonVersion || semver.satisfies(obj.pythonVersion, conditions.pythonVersion)) {
            return true
          }
        }

        return false
      }
    } else {
      // Convert "python3" to "py3" for matching against results from PyPi
      const matches = (conditions.pythonVersion ? conditions.pythonVersion.match(/python(\d+)/i) : null)
      const matchingWord = (matches && matches.length > 1 ? `py${matches[1]}` : conditions.pythonVersion)

      filterMethod = (val) => {
        for (let obj of Object.values(val)) {
          if (obj.pythonVersion && obj.pythonVersion.includes(matchingWord)) {
            return true
          }
        }

        return false
      }
    }

    return filteredVersions.filter(filterMethod)
  }

  /**
   *
   * @param {object} conditions
   * @param {array} filteredVersions
   *
   * @returns {array}
   */
  _filterByRequiresPython(conditions, filteredVersions) {
    const requiresPythonVersion = conditions.requiresPython
    const requiresPythonVersionCleaned = this.cleanSemver(conditions.requiresPython)
    const isRequiresPythonVersion = this.isLooslyValidVersion(requiresPythonVersion)
    let filterMethod

    if (isRequiresPythonVersion) {
      filterMethod = (val) => {
        for (let obj of Object.values(val)) {
          if (!obj.requiresPython || obj.requiresPython.length === 0) {
            continue
          }

          const parts = obj.requiresPython.split(',').map(s => s.trim())
          let result = true

          for (let part of parts) {
            // Transform PyPi versions syntax "!=" for proper comparision
            if (/!=/.test(part)) {
              if (semver.satisfies(requiresPythonVersionCleaned, part.replace('!=', '').replace('*', 'x'))) {
                result &= false
              }
            } else if (!semver.satisfies(requiresPythonVersionCleaned, part)) {
              result &= false
            }
          }

          return result
        }

        return false
      }
    } else {
      return filteredVersions
    }

    const result = filteredVersions.filter(filterMethod)

    // If nothting is found, take the latest one where requiresPython==null
    if (isRequiresPythonVersion && result.length === 0) {
      filteredVersions = filteredVersions.filter((val) => {
        for (let obj of Object.values(val)) {
          if (obj.requiresPython === null) {
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
