#!/usr/bin/env node
import fs from "fs-extra";
import { runCli } from "./cli/index.js";
import { createProject } from "./helpers/createProject.js";
import { buildPkgInstallerMap } from "./installers/index.js";
import { parseNameAndPath } from "./utils/parseNameAndPath.js";
// import { logger } from "~/utils/logger.js";
import { renderTitle } from "./utils/renderTitle.js";
import {
  getNpmVersion,
  renderVersionWarning,
} from "./utils/renderVersionWarning.js";
import { getUserPkgManager } from "./utils/getUserPkgManager.js";
import { PackageJson } from "type-fest";
import { getVersion } from "./utils/getVersion.js";
import path from "path";
import { execa } from "execa";
import { setImportAlias } from "./helpers/setImportAlias.js";
import { installDependencies } from "./helpers/installDependencies.js";
import { initializeGit } from "./helpers/git.js";
import { logNextSteps } from "./helpers/logNextSteps.js";

type CT3APackageJSON = PackageJson & {
  ct3aMetadata?: {
    initVersion: string;
  };
};

const main = async () => {
  // const npmVersion = await getNpmVersion();
  const pkgManager = getUserPkgManager();

  // npmVersion && renderVersionWarning(npmVersion);

  renderTitle();
  const {
    appName,
    packages,
    flags: { noGit, noInstall, importAlias, appRouter },
  } = await runCli();

  const usePackages = buildPkgInstallerMap(packages);
  const [scopedAppName, appDir] = parseNameAndPath(appName);

  const projectDir = await createProject({
    projectName: appDir,
    scopedAppName,
    packages: usePackages,
    importAlias,
    noInstall,
    appRouter,
  });

  const pkgJson = fs.readJSONSync(
    path.join(projectDir, "package.json"),
  ) as CT3APackageJSON;
  pkgJson.name = scopedAppName;
  pkgJson.ct3aMetadata = { initVersion: getVersion() };

  if (pkgManager !== "bun") {
    const { stdout } = await execa(pkgManager, ["-v"], {
      cwd: projectDir,
    });
    pkgJson.packageManager = `${pkgManager}@${stdout.trim()}`;
  }

  fs.writeJSONSync(path.join(projectDir, "package.json"), pkgJson, {
    spaces: 2,
  });

  // update import alias in any generated files if not using the default
  if (importAlias !== "~/") {
    setImportAlias(projectDir, importAlias);
  }

  if (!noInstall) {
    await installDependencies({ projectDir });
  }

  // Rename _eslintrc.json to .eslintrc.json - we use _eslintrc.json to avoid conflicts with the monorepos linter
  fs.renameSync(
    path.join(projectDir, "_eslintrc.cjs"),
    path.join(projectDir, ".eslintrc.cjs"),
  );

  if (!noGit) {
    await initializeGit(projectDir);
  }

  await logNextSteps({
    projectName: appDir,
    packages: usePackages,
    noInstall,
    projectDir,
  });

  process.exit(0);
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
