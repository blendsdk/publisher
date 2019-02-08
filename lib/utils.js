const fs = require("fs");
const logger = require("./log");
const git = require("./git");
const shell = require("shelljs");

function run_commands(commands) {
    logger.info(`Running ${commands.length} commands`);
    commands.forEach(command => {
        logger.info(`Running command: ${command}`);
        if (shell.exec(command).code !== 0) {
            logger.error(`Unable to run command: ${command}`);
        }
    });
    return true;
}

function patch_files(files, curVersion, newVersion) {
    files.forEach(file => {
        let content = fs.readFileSync(file).toString();
        ["devel", "dev", curVersion].forEach(str => {
            content = content.replace(str, newVersion);
        });
        logger.info(`Patching: ${file}`);
        fs.writeFileSync(file, content);
    });
    return true;
}

function set_package_version(packageFile, version, save_and_commit) {
    let package = JSON.parse(fs.readFileSync(packageFile).toString());
    package.version = version;
    fs.writeFileSync(packageFile, JSON.stringify(package, null, 4));
    if (save_and_commit) {
        if (git.add_file(packageFile)) {
            if (git.commit(`Bumped to version ${version}`)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}

module.exports = {
    run_commands,
    patch_files,
    set_package_version
};
