const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
require("dotenv").config();
const prod = process.env.NODE_ENV === "production";
const tasks = {};
const commands = [];

/* INIT */
function init() {
  execute(commands);
}

/* EXEC */
async function execute(commands) {
  for await (const command of commands) {
    if (!command.disabled) {
      const cmd = command.args.join(" ");
      const name = command.name;

      console.info(`Running: ${name} (${cmd})`);

      exec(cmd)
        .then(() => {
          console.info(`Complete: ${name}`);
        })
        .catch((error) => {
          console.error(`Error in command: ${name}. Error: ${error}`);
          process.exit();
        });
    }
  }
}

/* Build: _dist */
tasks.dist = {
  name: "mkdir:dist",
  args: ["mkdir", "-p", "dist"],
  // disabled: true,
};
commands.push(tasks.dist);

/* Build: css */
tasks.css = {
  name: "tailwind",
  args: ["npx", "tailwindcss", "-i", "src/includes/styles/input.css", "-o", "dist/output.css"],
  // disabled: true,
};
commands.push(tasks.css);

/* Build: js */
tasks.js = {
  name: "js",
  args: ["uglifyjs", "src/includes/scripts/input.js", "-cmo", "dist/output.js"],
  // disabled: true,
};
commands.push(tasks.js);

/* Build: json */
tasks.json = {
  name: "json",
  args: ["cp", "src/includes/scripts/sites.json", "dist/sites.json"],
  // disabled: true,
};
commands.push(tasks.json);

/* Build: html */
tasks.html = {
  name: "html",
  args: ["cp", "src/index.html", "dist/index.html"],
  // disabled: true,
};
commands.push(tasks.html);

/* Build: captures */
tasks.captures = [
  {
    name: "mkdir:screenshots",
    args: ["mkdir", "-p", "dist/screenshots"],
    // disabled: true,
  },
  {
    name: "captures",
    args: ["node", "captures.mjs"],
    // disabled: true,
  },
];
commands.push(...tasks.captures);

/* DEV */

/* LOCALHOST */
tasks.localhost = {
  name: "localhost",
  args: ["npx", "localhost", "dist"],
  // disabled: true,
};
if (!prod) commands.push(tasks.localhost);

/* WATCH */
if (!prod) {
  const watch = require("node-watch");
  const watchOptions = {
    recursive: true,
    filter: /\.(html|css|js(on)?)$/
  };
  watch("src", watchOptions, (evt, name) => {
    for (const ext of ["css", "html", "js", "json"]) {
      const re = new RegExp(`\.${ext}$`);
      if (re.test(name)) execute([tasks[ext]]);
    }
  });
}

/* Let's go */
init();
