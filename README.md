# BlendSDK Publisher

Publisher is a simple utility that is used to version and
release the blendsdk packages.

## Installation

```sh
npm install -g @@blendsdk/publisher
```

## Usage

```sh
publish patch | minor | major
```

The publish utility looks for a `publish.json` file for configuration. Based on the configuration the

`publish` command will:

-   First try to patch files configured in the `patch` from the config. It simple finds and replaces the
    words "dev" "devel" and the current version of the package with the new calculated version.

-   Then it will create a release branch and run the `commands` from the configuration and merge the
    release branch with the master branch and push the master branch to the `origin`

-   After that it will switch to the dev branch and run the `devCommands` and finally push the dev branch
    the `origin`

The `publish` command will also tag the master branch with the new version number.

The following is an example of the configuration file:

```json
{
    "patch": ["/path/to/a/file"],
    "commands": [
        "lerna run build",
        "lerna version %version% --no-git-tag-version -y",
        "git add .",
        "git commit -a -m'Bumped packages version to %version%'",
        "lerna publish %version% --no-git-tag-version -y"
    ],
    "devcommands": [
        "lerna version %version% --no-git-tag-version -y",
        "git add .",
        "git commit -a -m'Bumped packages version to %version%'"
    ]
}
```
