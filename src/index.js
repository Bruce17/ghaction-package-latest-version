const core = require('@actions/core');
const RegistryFactory = require('./registries/registry-factory');

async function run() {
  try {
    const package = core.getInput('package', { required: true })
    const language = core.getInput('language', { required: true })
    const registry = core.getInput('registry')
    const remoteType = core.getInput('remoteType') || 'json'
    const conditions = core.getInput('conditions') || ''

    const registryInstance = RegistryFactory.getRegistry(language)

    if (registry) {
      registryInstance.registry = registry
    }

    const latestVersion = await registryInstance.getLatestVersion({package, type: remoteType, conditions})

    core.setOutput('latestVersion', latestVersion)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
