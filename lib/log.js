require("colors");

function log(message) {
  console.log(message);
}

function warn(message) {
  console.log(`${"WARN".yellow}: ${message}`);
}

function error(message, exit) {
  console.log(`${"ERROR".red}: ${message}`);
  if (exit === true) {
    process.exit(1);
  }
}

function info(message) {
  console.log(`${"INFO".cyan}: ${message}`);
}

function banner(message) {
  log(message.green);
}

module.exports = { warn, log, info, error, banner };
