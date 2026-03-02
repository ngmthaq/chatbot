const { exec } = require("node:child_process");
const { promisify } = require("node:util");

const execPromise = promisify(exec);

module.exports = {
  execPromise,
};
