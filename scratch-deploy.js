import { spawn } from "child_process";
import fs from "fs";

const logFile = "deploy-log.txt";
fs.writeFileSync(logFile, "Starting catalyst deploy...\n");

const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(logFile, msg + "\n");
};

log("Executing catalyst deploy...");
const child = spawn("catalyst", ["deploy", "--project", "43414000000013024"], {
  shell: true,
  cwd: "d:\\ksp-prism-main",
});

child.stdout.on("data", (data) => {
  log(`STDOUT: ${data.toString()}`);
});

child.stderr.on("data", (data) => {
  log(`STDERR: ${data.toString()}`);
});

child.on("close", (code) => {
  log(`Process exited with code ${code}`);
});

child.on("error", (err) => {
  log(`Process error: ${err.message}`);
});
