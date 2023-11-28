import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";

import { type AvailableDependencies } from "./dependecyVersionMap.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const authJsInstaller: Installer = ({ projectDir, packages }) => {
  const usingPrisma = packages?.prisma.inUse;

  const deps: AvailableDependencies[] = ["@auth/core"];
  if (usingPrisma) deps.push("@auth/prisma-adapter");
  deps.push("next-auth"); // beta is required since Auth js is experimental

  addPackageDependency({
    projectDir,
    dependencies: deps,
    devMode: false,
    usingAuthJs: true,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const extendedTypesFile = "types/next-auth.d.ts";

  const extendedTypesSrc = path.join(extrasDir, extendedTypesFile);
  const extendedTypesDest = path.join(projectDir, extendedTypesFile);
  // The file is named authjs.ts to avoid conflict with the existing route.ts from Next Auth
  const routeHandlerFile = "src/app/api/auth/[...nextauth]/authjs.ts";
  const srcToUse = routeHandlerFile;

  // Here we rename the file
  const authDest = "src/app/api/auth/[...nextauth]/route.ts";

  const apiHandlerSrc = path.join(extrasDir, srcToUse);
  const apiHandlerDest = path.join(projectDir, authDest);

  const authConfigSrc = path.join(
    extrasDir,
    "src/",
    usingPrisma ? "auth-with-prisma.ts" : "auth.ts",
  );
  const authConfigDest = path.join(projectDir, "src/auth.ts");

  fs.copySync(apiHandlerSrc, apiHandlerDest);
  fs.copySync(authConfigSrc, authConfigDest);
  fs.copySync(extendedTypesSrc, extendedTypesDest);
};
