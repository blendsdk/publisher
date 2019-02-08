const fs = require("fs");
const path = require("path");
const _ = require("lodash");

module.exports = function() {
    try {
        let config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "publish.json")).toString());
        config.patch = _.isArray(config.patch || []) ? config.patch : [config.patch];
        return config;
    } catch (err) {
        return {
            patch: []
        };
    }
};
