const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const testsDir = path.join(process.cwd(), "tests");

const hasTestFiles = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return false;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (hasTestFiles(fullPath)) {
        return true;
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".test.js")) {
      return true;
    }
  }

  return false;
};

const runTests = () => {
  if (!hasTestFiles(testsDir)) {
    console.log("Nenhum arquivo de teste encontrado em tests/**/*.test.js");
    process.exit(0);
  }

  console.log("🧪 Executando testes...\n");

  const jest = spawn(
    "node",
    ["node_modules/jest/bin/jest.js", "--runInBand", "--no-cache", "--forceExit"],
    {
      cwd: process.cwd(),
      stdio: "inherit"
    }
  );

  jest.on("close", (code) => {
    process.exit(code ?? 1);
  });
};

runTests();
