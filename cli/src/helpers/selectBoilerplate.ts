import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type InstallerOptions } from "~/installers/index.js";

type SelectBoilerplateProps = Required<
  Pick<InstallerOptions, "packages" | "projectDir">
>;
// This generates the _app.tsx file that is used to render the app
// export const selectAppFile = ({
//   projectDir,
//   packages,
// }: SelectBoilerplateProps) => {
//   const appFileDir = path.join(PKG_ROOT, "template/extras/src/pages/_app");

//   const usingNextAuth = packages.nextAuth.inUse;

//   let appFile = "base.tsx";

//   if (usingNextAuth) {
//     appFile = "with-auth.tsx";
//   }

//   const appSrc = path.join(appFileDir, appFile);
//   const appDest = path.join(projectDir, "src/pages/_app.tsx");
//   fs.copySync(appSrc, appDest);
// };

export const selectLayoutFile = ({
  projectDir,
  packages,
}: SelectBoilerplateProps) => {
  const layoutFileDir = path.join(PKG_ROOT, "template/extras/src/app/layout");

  const usingTw = packages.tailwind.inUse;
  let layoutFile = "base.tsx";
  if (usingTw) {
    layoutFile = "with-tw.tsx";
  }

  const appSrc = path.join(layoutFileDir, layoutFile);
  const appDest = path.join(projectDir, "src/app/layout.tsx");

  fs.copySync(appSrc, appDest);
  // fs.copySync(faviconSrc, faviconDest);
};

export const selectIndexFile = ({
  projectDir,
  packages,
}: SelectBoilerplateProps) => {
  const indexFileDir = path.join(PKG_ROOT, "template/extras/src/app/page");

  const usingTw = packages.tailwind.inUse;
  const usingShadcn = packages["shadcn/ui"].inUse;

  let indexFile = "base.tsx";
  if (usingTw && usingShadcn) {
    indexFile = "with-tw-shadcn.tsx";
  } else if (usingTw) {
    indexFile = "with-tw.tsx";
  }

  const indexSrc = path.join(indexFileDir, indexFile);
  const indexDest = path.join(projectDir, "src/app/page.tsx");
  fs.copySync(indexSrc, indexDest);
};
