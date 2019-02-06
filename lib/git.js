const shell = require("shelljs");

function is_clean() {
  return (
    shell.exec("git status --porcelain", { silent: true }).stdout.toString()
      .length === 0
  );
}

function branch_name() {
  return shell
    .exec("git rev-parse --abbrev-ref HEAD", { silent: true })
    .stdout.toString();
}

module.exports = {
  is_clean,
  branch_name
};
