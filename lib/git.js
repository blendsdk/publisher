const shell = require("shelljs");
const logger = require("./log");

function is_clean() {
    return shell.exec("git status --porcelain", { silent: true }).stdout.toString().length === 0;
}

function branch_name() {
    return shell
        .exec("git rev-parse --abbrev-ref HEAD", { silent: true })
        .stdout.toString()
        .trim();
}

function add_all() {
    return shell.exec("git add .").code === 0;
}

function add_file(file) {
    return shell.exec(`git add ${file}`).code === 0;
}

function commit(message) {
    return shell.exec(`git commit -m"${message}"`).code === 0;
}

function is_dev_branch() {
    return branch_name() === "devel" || branch_name() === "dev";
}

function create_release_branch(version) {
    const branch = `release-${version}`;
    if (shell.exec(`git checkout -b ${branch}`).code === 0) {
        return branch;
    } else {
        throw new Error(`Unable to create a release branch ${version}`);
    }
}

function tag_branch(version, comment) {
    comment = comment || `Release version ${version}`;
    return shell.exec(`git tag -a v${version} -m "${comment}"`).code === 0;
}

function push_branch(branch) {
    logger.info(`Pushing ${branch}`);
    return shell.exec(`git push origin ${branch} --follow-tags`).code === 0;
}

function delete_branch(branch) {
    return shell.exec(`git branch -D ${branch}`).code === 0;
}

function switch_branch(branch) {
    return shell.exec(`git checkout ${branch}`).code === 0;
}

function merge_to(branch, from) {
    const curBranch = branch_name();
    if (is_clean()) {
        if (shell.exec(`git checkout ${branch}`).code === 0) {
            if (shell.exec(`git merge -X theirs --no-ff -m"Merging ${from}" ${from}`).code === 0) {
                return true;
            } else {
                logger.error(`Merging the ${branch} branch failed!`);
            }
        } else {
            logger.error(`Switching to ${branch} failed!`);
        }
    } else {
        logger.error(`Cannot merge to ${branch}! The ${curBranch} is not clean.`);
    }
}

module.exports = {
    tag_branch,
    push_branch,
    add_file,
    switch_branch,
    delete_branch,
    merge_to,
    commit,
    add_all,
    is_clean,
    branch_name,
    create_release_branch,
    is_dev_branch
};
