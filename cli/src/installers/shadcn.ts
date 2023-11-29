import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const shadcnInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: [
      "clsx",
      "@radix-ui/react-icons",
      "class-variance-authority",
      "tailwind-merge",
      "tailwindcss-animate",
    ],
    devMode: true,
    usingAuthJs: false, //FIXME: remove when authJs is fully supported
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const shadcnCfgSrc = path.join(extrasDir, "config/components.json");
  const shadcnCfgDest = path.join(projectDir, "components.json");

  const shadcnUtilsSrc = path.join(extrasDir, "src/lib/utils.ts");
  const shadcnUtilsDest = path.join(projectDir, "src/lib/utils.ts");

  const shadcnCardSrc = path.join(extrasDir, "src/components/ui/card.tsx");
  const shadcnCardDest = path.join(projectDir, "src/components/ui/card.tsx");

  fs.copySync(shadcnCfgSrc, shadcnCfgDest);
  fs.copySync(shadcnUtilsSrc, shadcnUtilsDest);
  fs.copySync(shadcnCardSrc, shadcnCardDest);
};
