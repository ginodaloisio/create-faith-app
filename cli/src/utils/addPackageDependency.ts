import path from "path";
import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import { type PackageJson } from "type-fest";

import {
  dependencyVersionMap,
  type AvailableDependencies,
} from "~/installers/dependecyVersionMap.js";

export const addPackageDependency = (opts: {
  dependencies: AvailableDependencies[];
  devMode: boolean;
  projectDir: string;
  usingAuthJs: boolean; //FIXME: this is temporary since AuthJs requires Next Auth beta version (^5.0.0-beta.3)
}) => {
  const { dependencies, devMode, projectDir } = opts;

  const pkgJson = fs.readJSONSync(
    path.join(projectDir, "package.json")
  ) as PackageJson;

  dependencies.forEach((pkgName) => {
    const version = dependencyVersionMap[pkgName];

    if (devMode && pkgJson.devDependencies) {
      pkgJson.devDependencies[pkgName] = version;
    } else if (pkgJson.dependencies) {
      pkgJson.dependencies[pkgName] = version;
    }
    if (pkgName === "next-auth" && opts.usingAuthJs && pkgJson.dependencies) {
      pkgJson.dependencies[pkgName] = "^5.0.0-beta.3"; //FIXME: forcing next-auth beta since we're using auth js
    }
  });
  const sortedPkgJson = sortPackageJson(pkgJson);

  fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
    spaces: 2,
  });
};
