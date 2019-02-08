const fs = require("fs");
const logger = require("./log");

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

function set_package_version(version) {}

module.exports = {
    patch_files
};
