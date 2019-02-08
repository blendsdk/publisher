const fs = require("fs");
const path = require("path");
const logger = require("./log");
const _ = require("lodash");

module.exports = function() {
    try {
        let config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "publish.json")).toString());
        config.patch = _.isArray(config.patch || []) ? config.patch : [config.patch];
        config.commands = _.isArray(config.commands || []) ? config.commands : [config.commands];
        return config;
    } catch (err) {
        logger.warn(err);
        return {
            patch: [],
            commands: []
        };
    }
};
