#!/usr/bin/env node
const logger = require("./lib/log");
const git = require("./lib/git");
const pkg = require("./lib/package");
const cmd = require("./lib/commandline");
const bumpVersion = require("semver-increment");
const config = require("./lib/config")();
const utils = require("./lib/utils");
const publishFrom = config.publishFrom || "master";
const pushDevelBranch = config.pushDevelBranch === undefined ? true : config.pushDevelBranch;
const commands = config.commands || [];
const devCommands = config.devCommands || [];

const fs = require("fs");

let package = pkg.get_package();

logger.banner(`BlendSDK Project Publisher v${package.version}`);

// check the command lien parameter
if (cmd.check()) {
    const curBranch = git.branch_name();
    const curVersion = package.version || "0.0.0";
    // check if dev or devel branch
    if (git.is_dev_branch()) {
        // check if git is clean
        if (git.is_clean()) {
            // calculate a new version
            let newVersion = bumpVersion(cmd.versionType(), curVersion);
            logger.info(`The new version is: ${newVersion}`);
            // creating a new release branch
            relBranch = git.create_release_branch(newVersion);
            if (utils.set_package_version(pkg.get_package_file(), newVersion, false)) {
                // patch the files
                if (utils.patch_files(config.patch || [], curVersion, newVersion)) {
                    // stage all patched files
                    if (git.add_all()) {
                        // commit the changes
                        if (git.commit(`Patched files to ${newVersion}`)) {
                            // run external command from config
                            if (utils.run_commands(commands, newVersion)) {
                                // merge the release branch to the branch that is being published from
                                if (git.merge_to(publishFrom, relBranch)) {
                                    // tag the master branch
                                    if (git.tag_branch(newVersion)) {
                                        // push the master branch
                                        if (git.push_branch(publishFrom)) {
                                            // delete the release branch
                                            if (git.delete_branch(relBranch)) {
                                                // switch to the dev branch
                                                if (git.switch_branch(curBranch)) {
                                                    // set the version of the devel branch
                                                    if (utils.run_commands(devCommands, newVersion)) {
                                                        if (
                                                            utils.set_package_version(
                                                                pkg.get_package_file(),
                                                                newVersion,
                                                                true
                                                            )
                                                        ) {
                                                            // push the devel branch
                                                            if (pushDevelBranch) {
                                                                if (git.push_branch(curBranch)) {
                                                                    logger.info("All Done");
                                                                }
                                                            } else {
                                                                logger.info("All Done");
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                logger.error(`Deleting branch ${relBranch} failed!`);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            logger.error("git commit failed!");
                        }
                    } else {
                        logger.error("git add all failed!");
                    }
                }
            }
        } else {
            logger.error(`The ${curBranch} branch is not clean!`);
        }
    } else {
        logger.error(`${curBranch} is not on the development branch!`);
    }
}
