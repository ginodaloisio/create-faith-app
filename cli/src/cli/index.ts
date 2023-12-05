import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";

import { CREATE_FAITH_APP, DEFAULT_APP_NAME } from "~/consts.js";
import { type AvailablePackages } from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { getVersion } from "~/utils/getVersion.js";
import { IsTTYError } from "~/utils/isTTYError.js";
import { logger } from "~/utils/logger.js";
import { validateAppName } from "~/utils/validateAppName.js";
import { validateImportAlias } from "~/utils/validateImportAlias.js";

interface cliFlags {
  noGit: boolean;
  noInstall: boolean;
  default: boolean;
  importAlias: string;

  /** @internal Used in CI. */
  CI: boolean;
  /** @internal Used in CI. */
  tailwind: boolean;
  /** @internal Used in CI. */
  prisma: boolean;
  /** @internal Used in CI. */
  nextAuth: boolean;
  /** @internal Used in CI. */
  appRouter: boolean;
  /** @internal Used in CI */
  authJs: boolean;
  /** @internal Used in CI */
  shadcn: boolean;
}

interface cliResults {
  appName: string;
  packages: AvailablePackages[];
  flags: cliFlags;
}

const defaultOptions: cliResults = {
  appName: DEFAULT_APP_NAME,
  packages: ["nextAuth", "prisma", "tailwind", "shadcn/ui"],
  flags: {
    noGit: false,
    noInstall: false,
    default: false,
    CI: false,
    tailwind: true,
    prisma: true,
    nextAuth: true,
    authJs: false,
    importAlias: "@/",
    appRouter: true,
    shadcn: true,
  },
};

export const runCli = async (): Promise<cliResults> => {
  const cliResults = defaultOptions;

  const program = new Command()
    .name(CREATE_FAITH_APP)
    .description("A CLI to create a new web application using faith's stack")
    .argument("[dir]", "Name of the application")
    .option(
      "--noInstall",
      "Hold the cli from running the package manager's install command",
      false
    )
    .option(
      "-y, --default",
      "Bypass the CLI and bootstrap a new default faith-app"
    )
    /** START CI-FLAGS */
    /**
     * @experimental Used for CI E2E tests. If any of the following option-flags are provided, we
     *               skip prompting.
     */
    .option("--CI", "Boolean value if we're running in CI", false)
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--tailwind [boolean]",
      "Experimental: Boolean value if we should install Tailwind CSS. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--nextAuth [boolean]",
      "Experimental: Boolean value if we should install NextAuth.js. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--authjs [boolean]",
      "Experimental: Boolean value if we should install Auth.js. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false"
    )
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--prisma [boolean]",
      "Experimental: Boolean value if we should install Prisma. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false"
    )
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--shadcn [boolean]",
      "Experimental: Boolean value if we should install Shadcn/UI. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false"
    )
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "-i, --import-alias",
      "Explicitly tell the CLI to use a custom import alias",
      defaultOptions.flags.importAlias
    )
    .version(getVersion(), "-v, --version", "Display the version number")
    .addHelpText(
      "afterAll",
      `\nThe F3 stack was inspired by ${chalk
        .hex("#E8DCFF")
        .bold("create-t3-app")}`
    )
    .parse(process.argv);

  const cliProvidedName = program.args[0];
  if (cliProvidedName) {
    cliResults.appName = cliProvidedName;
  }

  cliResults.flags = program.opts();

  /** @internal Used for CI E2E tests. */
  if (cliResults.flags.CI) {
    cliResults.packages = [];
    if (cliResults.flags.tailwind) cliResults.packages.push("tailwind");
    if (cliResults.flags.prisma) cliResults.packages.push("prisma");
    if (cliResults.flags.nextAuth) cliResults.packages.push("nextAuth");
    if (cliResults.flags.authJs) cliResults.packages.push("authJs");
    if (cliResults.flags.shadcn) cliResults.packages.push("shadcn/ui");
    if (cliResults.flags.nextAuth && cliResults.flags.authJs) {
      logger.warn("Incompatible combination NextAuth + AuthJs. Exiting.");
      process.exit(0);
    }
    return cliResults;
  }

  if (cliResults.flags.default) {
    return cliResults;
  }
  try {
    if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
      logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are 
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal. Alternatively, you 
  can provide the arguments from the CLI directly: https://create.t3.gg/en/installation#experimental-usage to skip the prompts.`);

      throw new IsTTYError("Non-interactive environment");
    }

    const pkgManager = getUserPkgManager();
    const project = await p.group(
      {
        ...(!cliProvidedName && {
          name: () =>
            p.text({
              message: "What will your project be called?",
              defaultValue: cliProvidedName,
              validate: validateAppName,
            }),
        }),
        language: () => {
          return p.select({
            message: "Will you be using TypeScript or JavaScript?",
            options: [
              { value: "typescript", label: "TypeScript" },
              { value: "javascript", label: "JavaScript" },
            ],
            initialValue: "typescript",
          });
        },
        _: ({ results }) =>
          results.language === "javascript"
            ? p.note(
                chalk.bgRedBright("Wrong answer, using Typescript"),
                "Info"
              )
            : undefined,
        styling: async () => {
          const usingTw = await p.confirm({
            message: "Will you be using Tailwind CSS for styling?",
          });
          if (!usingTw) {
            p.note(
              `Since you're not using tailwind we recommend you to use: ` +
                chalk.bgCyan(
                  `${getUserPkgManager()} create ${
                    pkgManager === "yarn" ? "t3-app" : "t3-app@latest"
                  }`
                )
            );
            return process.exit(1);
          } else return true;
        },
        shadcn: () => {
          return p.confirm({
            message: "Will you be using shadcn/ui component library?",
          });
        },
        appRouter: async () => {
          const appRouter = await p.confirm({
            message:
              chalk.bgCyan(" RECOMMENDED ") +
              " Would you like to use Next.js App Router?",
            initialValue: true,
          });
          if (!appRouter) {
            p.note(
              `Since you're not using the app router we recommend you to use: ` +
                chalk.bgCyan(
                  `${getUserPkgManager()} create ${
                    pkgManager === "yarn" ? "t3-app" : "t3-app@latest"
                  }`
                )
            );
            return process.exit(1);
          } else return true;
        },
        authentication: () => {
          return p.select({
            message: "What authentication provider would you like to use?",
            options: [
              { value: "none", label: "None" },
              { value: "next-auth", label: "NextAuth.js" },
              {
                value: "auth-js",
                label: "Auth.js " + chalk.bgRedBright("EXPERIMENTAL "),
              },
            ],
            initialValue: "next-auth",
          });
        },
        database: () => {
          return p.select({
            message: "What database ORM would you like to use?",
            options: [
              { value: "none", label: "None" },
              {
                value: "prisma",
                label: "Prisma " + chalk.bgCyan("RECOMMENDED "),
              },
            ],
            initialValue: "prisma",
          });
        },
        ...(!cliResults.flags.noGit && {
          git: () => {
            return p.confirm({
              message:
                "Should we initialize a Git repository and stage the changes?",
              initialValue: !defaultOptions.flags.noGit,
            });
          },
        }),
        ...(!cliResults.flags.noInstall && {
          install: () => {
            return p.confirm({
              message:
                `Should we run '${getUserPkgManager()}` +
                (pkgManager === "yarn" ? `'?` : ` install' for you?`),
              initialValue: !defaultOptions.flags.noInstall,
            });
          },
        }),
        importAlias: () => {
          return p.text({
            message: "What import alias would you like to use?",
            defaultValue: defaultOptions.flags.importAlias,
            placeholder: defaultOptions.flags.importAlias,
            validate: validateImportAlias,
          });
        },
      },
      {
        onCancel() {
          process.exit(1);
        },
      }
    );

    const packages: AvailablePackages[] = [];
    if (project.styling) packages.push("tailwind");
    if (project.shadcn) packages.push("shadcn/ui");
    if (project.authentication === "next-auth") {
      packages.push("nextAuth");
    } else if (project.authentication === "auth-js") {
      packages.push("authJs");
    }
    if (project.database === "prisma") packages.push("prisma");

    return {
      appName: project.name ?? cliResults.appName,
      packages,
      flags: {
        ...cliResults.flags,
        appRouter: project.appRouter ?? cliResults.flags.appRouter,
        noGit: !project.git ?? cliResults.flags.noGit,
        noInstall: !project.install ?? cliResults.flags.noInstall,
        importAlias: project.importAlias ?? cliResults.flags.importAlias,
      },
    };
  } catch (err) {
    // If the user is not calling create-faith-app from an interactive terminal, inquirer will throw an IsTTYError
    // If this happens, we catch the error, tell the user what has happened, and then continue to run the program with a default faith app
    if (err instanceof IsTTYError) {
      logger.warn(`
  ${CREATE_FAITH_APP} needs an interactive terminal to provide options`);

      const shouldContinue = await p.confirm({
        message: `Continue scaffolding a default faith app?`,
        initialValue: true,
      });

      if (!shouldContinue) {
        logger.info("Exiting...");
        process.exit(0);
      }

      logger.info(
        `Bootstrapping a default faith app in ./${cliResults.appName}`
      );
    } else {
      throw err;
    }
  }

  return cliResults;
};
