#!/usr/bin/env node
const logger = require("./lib/log");
const git = require("./lib/git");
const package = require("./lib/package")();
const cmd = require("./lib/commandline");
const bumpVersion = require("semver-increment");

logger.banner("BlendSDK Project Publisher");

if (cmd.check()) {
  logger.info(bumpVersion(cmd.versionType, package.version));
  logger.info(process.cwd());
}
