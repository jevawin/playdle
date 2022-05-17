// TODO callback tasks
// TODO pipe to tasks
// TODO run without recapturing if pics are < X days old
const { exec } = require("node:child_process");
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
  for (const command of commands) {
    if (!command.disabled) {
      const cmd = command.args.join(" ");
      const name = command.name;

      console.info(`Running: ${name} (${cmd})`);

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error in command: ${name}. Error: ${error}`);
          process.exit();
        }
        if (stdout && stdout !== "") console.log(`${name}: ${stdout}`);
        if (stderr && stderr !== "") console.error(`${name}: ${stderr}`);
        console.log(`Complete: ${name}`);
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
if (prod) tasks.css.args.push("--minify");
commands.push(tasks.css);

/* Build: json */
tasks.json = {
  name: "json",
  args: ["cp", "src/includes/scripts/sites.json", "dist/sites.json"],
  // disabled: true,
};
commands.push(tasks.json);

/* Build: ejs */
tasks.ejs = {
  name: "ejs",
  args: [
    // ejs templates
    "npx",
    "ejs",
    "src/index.ejs",
    "-f",
    "src/includes/scripts/sites.json",
    "|",
    // html minification
    "npx",
    "html-minifier",
    "-o",
    "dist/index.html",
    "--collapse-whitespace",
    "--remove-attribute-quotes",
    "--remove-comments",
    "--remove-optional-tags",
    "--remove-redundant-attributes",
    "--remove-script-type-attributes",
    "--use-short-doctype",
    "--sort-attributes",
    "--sort-class-name",
  ],
  // disabled: true,
};
commands.push(tasks.ejs);

/* Build: icons */
tasks.icons = {
  name: "icons",
  args: ["cp", "-r", "src/icons", "dist/icons"],
  // disabled: true,
};
commands.push(tasks.icons);

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

/* BROWSER-SYNC */
tasks.browserStart = {
  name: "browser-sync",
  args: [
    "npx",
    "browser-sync",
    "start",
    "--server",
    "dist",
    "--port",
    "8080",
    "--no-open",
    "--no-ui",
    "--no-notify",
  ],
  // disabled: true,
};
if (!prod) commands.push(tasks.browserStart);

tasks.browserReload = {
  name: "browser-sync:reload",
  args: ["npx", "browser-sync", "reload", "--port", "8080"],
};

/* WATCH */
if (!prod) {
  const watch = require("node-watch");
  const watchOptions = {
    recursive: true,
    filter: /\.(css|e?js(on)?)$/,
  };
  watch("src", watchOptions, (evt, name) => {
    if (evt === "update") {
      for (const ext of ["css", "ejs", "js", "json"]) {
        // Iterate over extensions, build if extension was saved
        const re = new RegExp(`\\.${ext}$`);
        if (re.test(name)) execute([tasks[ext]]);
      }
      // Also run tailwind for js/ejs
      if (/e?js$/.test(name)) execute([tasks.css]);
      // Reload browsers
      execute([tasks.browserReload]);
    }
  });
}

/* Let's go */
init();
