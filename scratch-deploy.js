import { spawn } from "child_process";
import fs from "fs";

const logFile = "deploy-log.txt";
fs.writeFileSync(logFile, "Starting catalyst deploy...\n");

const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(logFile, msg + "\n");
};

const cwd = "d:\\ksp-prism-main";

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      cwd,
    });

    child.stdout.on("data", (data) => {
      log(`STDOUT: ${data.toString()}`);
    });

    child.stderr.on("data", (data) => {
      log(`STDERR: ${data.toString()}`);
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    log("Running npm run build before deploy...");
    await runCommand("npm", ["run", "build"]);

    log("Executing catalyst deploy...");
    await runCommand("catalyst", [
      "deploy",
      "--project",
      "43414000000013024",
      "--only",
      "appsail:ksp-crimeiq",
    ]);

    log("Deployment completed successfully.");
  } catch (err) {
    log(`Deployment failed: ${err.message}`);
    process.exit(1);
  }
}

main();
