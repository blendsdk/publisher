const logger = require("./log");

const argv = process.argv;
const versions = {
    patch: [0, 0, 1],
    minor: [0, 1, 0],
    major: [1, 0, 0]
};
const vTypes = Object.keys(versions);
const vType = argv[2];

function check() {
    const help = `Please provide a version type: ${vTypes.join(", ")}`;
    if (argv.length !== 3) {
        logger.error(help, true);
    } else if (vTypes.indexOf(vType) === -1) {
        logger.error(`Invalid version type ${vType}! ${help}`, true);
    } else {
        return true;
    }
}

function versionType() {
    return versions[vType];
}

module.exports = {
    check,
    versionType
};
