const fs = require("fs");
const path = require("path");

function get_package() {
	return JSON.parse(fs.readFileSync(get_package_file()).toString());
}

function get_package_file() {
	return path.join(process.cwd(), "package.json");
}

module.exports = {
	get_package,
	get_package_file
};
