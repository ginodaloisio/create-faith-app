import { DEFAULT_APP_NAME } from "~/consts.js";
import { type InstallerOptions } from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { logger } from "~/utils/logger.js";
import { isInsideGitRepo, isRootGitRepo } from "./git.js";

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = async ({
  projectName = DEFAULT_APP_NAME,
  packages,
  noInstall,
  projectDir,
}: Pick<
  InstallerOptions,
  "projectName" | "packages" | "noInstall" | "projectDir"
>) => {
  const pkgManager = getUserPkgManager();

  logger.info("Next steps:");
  projectName !== "." && logger.info(`  cd ${projectName}`);
  if (noInstall) {
    // To reflect yarn's default behavior of installing packages when no additional args provided
    if (pkgManager === "yarn") {
      logger.info(`  ${pkgManager}`);
    } else {
      logger.info(`  ${pkgManager} install`);
    }
  }

  // if (packages?.["shadcn/ui"].inUse) {
  //   logger.warn("this is important, since we can't install shadcn for you");
  //   if (pkgManager.includes("bun"))
  //     logger.info(`  bunx --bun shadcn-ui@latest init`);
  //   if (["npm", "yarn"]) logger.info(`  npx shadcn-ui@latest init`);
  //   if (pkgManager.includes("pnpm"))
  //     logger.info(`  pnpm dlx shadcn-ui@latest init`);
  // }

  if (packages?.prisma.inUse) {
    if (["npm", "bun"].includes(pkgManager)) {
      logger.info(`  ${pkgManager} run db:push`);
    } else {
      logger.info(`  ${pkgManager} db:push`);
    }
  }

  if (packages?.authJs.inUse || packages?.nextAuth.inUse) {
    logger.warn(
      "  you'll not be able to test authentication unless you change the .env variables",
    );
  }

  if (["npm", "bun"].includes(pkgManager)) {
    logger.info(`  ${pkgManager} run dev`);
  } else {
    logger.info(`  ${pkgManager} dev`);
  }

  if (!(await isInsideGitRepo(projectDir)) && !isRootGitRepo(projectDir)) {
    logger.info(`  git init`);
  }
  logger.info(`  git commit -m "initial commit"`);

  logger.warn(
    `\nThank you for trying out faith's personal stack. If you encounter any issues, please open an issue!`,
  );
};
