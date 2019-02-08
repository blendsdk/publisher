#!/usr/bin/env node
const logger = require("./lib/log");
const git = require("./lib/git");
let package = require("./lib/package")();
const cmd = require("./lib/commandline");
const bumpVersion = require("semver-increment");
const config = require("./lib/config")();
const utils = require("./lib/utils");
const publishFrom = config.publishFrom || "master";
const fs = require("fs");

logger.banner("BlendSDK Project Publisher");

if (cmd.check()) {
    const curBranch = git.branch_name();
    const curVersion = package.version || "0.0.0";
    if (git.is_dev_branch()) {
        if (git.is_clean()) {
            let newVersion = bumpVersion(cmd.versionType, curVersion);
            relBranch = git.create_release_branch(newVersion);
            if (utils.patch_files(config.patch, curVersion, newVersion)) {
                if (git.add_all()) {
                    if (git.commit(`Patched files to ${newVersion}`)) {
                        if (git.merge_to(publishFrom, relBranch)) {
                            if (git.delete_branch(relBranch)) {
                                if (git.switch_branch(curBranch)) {
                                    package.version = newVersion;
                                    fs.writeFileSync("package.json", JSON.stringify(package, null, 4));
                                    git.commit(`Bumpted version to ${newVersion}`);
                                    logger.info("All Done");
                                }
                            } else {
                                logger.error(`Deleting branch ${relBranch} failed!`);
                            }
                        }
                    } else {
                        logger.error("git commit failed!");
                    }
                } else {
                    logger.error("git add all failed!");
                }
            }
        } else {
            logger.error(`The ${curBranch} branch is not clean!`);
        }
    } else {
        logger.error(`${curBranch} is not on the development branch!`);
    }
}
