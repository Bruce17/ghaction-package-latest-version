# About

<p align="center">
  <a href="https://github.com/bruce17/ghaction-package-version/releases/latest"><img alt="package version latest release" src="https://img.shields.io/github/release/bruce17/ghaction-package-version.svg?style=flat"></a>
  <a href="https://github.com/marketplace/actions/package-version"><img alt="marketplace package version" src="https://img.shields.io/badge/marketplace-package--version-blue?logo=github&style=flat"></a>
  <a href="https://github.com/bruce17/ghaction-package-version/actions"><img alt="javscript-action status" src="https://github.com/bruce17/ghaction-package-version/workflows/units-test/badge.svg"></a>
</p>

:octocat: GitHub Action to get the latest available version of a package on its remote registry (PyPi, NPM etc.)

___

* [Customizing](#customizing)
  * [Inputs](#inputs)
  * [Outputs](#outputs)
* [Todo](#todo)
* [Keep up-to-date with GitHub Dependabot](#keep-up-to-date-with-github-dependabot)
* [Contributing](#contributing)
* [License](#license)


## Customizing

### Inputs

Following inputs can be used as step.with keys:

| Name       | Type      | Description |
|------------|-----------|-------------|
| package    | string    | Name of the package to search for. |
| language   | string    | The target language and thus backend registry. Available options: `python` |
| registry   | string    | Backend registry to search for the package. Format: `http(s)://some.backend.com/with/search/for/%s` where `%s` will be replaced by the actual package name. Example for PyPi: `https://pypi.org/pypi/%s/json` |
| remoteType | string    | Expect this file type from the backend result. Default: `json`. |
| conditions | multiline | Optional search conditions for a specific registry, see [Python Conditions](#python-conditions). Default: `''` |

By choosing a `language` (e.g. `python`) the registry url will automatically set to default one (e.g. `PyPi` for `python`). You can however overwrite it with a custom registry if required.

#### Python Conditions

For python there are some conditions to filter the found packages. PyPi returns some Python version requirements in its backend result:

```json
  "python_version": "py2.py3",
  "requires_python": ">=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*, !=3.4.*",
```

You can filter for Python v2 packages by passing this filter:

```yaml
    # ...
    - uses: bruce17/package-version@v1
      with:
        package: flask
        language: python
        conditions: |
          pythonVersion: py2
```

Same is possible for a specfic python version:

```yaml
    # ...
    - uses: bruce17/package-version@v1
      with:
        package: flask
        language: python
        conditions: |
          pythonVersion: 2.7
```


### Outputs

Following outputs are available:

| Name          | Type      | Description |
|---------------|-----------|-------------|
| latestVersion | string    | Latest found package version in the registry. |


## Todo

At the moment only one language/registry is supported:

[ ] Add support for Node.js/NPM


## Keep up-to-date with GitHub Dependabot

Since [Dependabot](https://docs.github.com/en/github/administering-a-repository/keeping-your-actions-up-to-date-with-github-dependabot) has [native GitHub Actions support](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates#package-ecosystem), to enable it on your GitHub repo all you need to do is add the `.github/dependabot.yml` file:

```yaml
version: 2
updates:
  # Maintain dependencies for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
```

## Contributing

Want to contribute? Awesome! The most basic way to show your support is to star :star2: the project, or to raise issues :speech_balloon:. If you want to open a pull request, please read the [contributing guidelines](.github/CONTRIBUTING.md).


## License

MIT. See `LICENSE` for more details.
