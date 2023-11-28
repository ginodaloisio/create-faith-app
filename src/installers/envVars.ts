import path from "path";
import fs from "fs-extra";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";

export const envVariablesInstaller: Installer = ({ projectDir, packages }) => {
  const usingNextAuth = packages?.nextAuth.inUse;
  const usingPrisma = packages?.prisma.inUse;
  const usingAuthJs = packages?.authJs.inUse;
  const usingDb = usingPrisma;

  const envContent = getEnvContent(
    !!usingNextAuth,
    !!usingPrisma,
    !!usingAuthJs,
  );

  //TODO: make this more readable
  const envFile =
    usingAuthJs && usingDb
      ? "with-authjs-db.js"
      : usingAuthJs
        ? "with-authjs.js"
        : usingNextAuth && usingDb
          ? "with-auth-db.js"
          : usingNextAuth
            ? "with-auth.js"
            : usingDb
              ? "with-db.js"
              : "";

  if (envFile !== "") {
    const envSchemaSrc = path.join(
      PKG_ROOT,
      "template/extras/src/env",
      envFile,
    );
    const envSchemaDest = path.join(projectDir, "src/env.js");
    fs.copySync(envSchemaSrc, envSchemaDest);
  }

  const envDest = path.join(projectDir, ".env");
  const envExampleDest = path.join(projectDir, ".env.example");

  fs.writeFileSync(envDest, envContent, "utf-8");
  fs.writeFileSync(envExampleDest, exampleEnvContent + envContent, "utf-8");
};

const getEnvContent = (
  usingNextAuth: boolean,
  usingPrisma: boolean,
  usingAuthJs: boolean,
) => {
  let content = `
# When adding additional environment variables, the schema in "/src/env.js"
# should be updated accordingly.
`
    .trim()
    .concat("\n");

  if (usingPrisma)
    content += `
# Prisma
# https://www.prisma.io/docs/reference/database-reference/connection-urls#env
DATABASE_URL="file:./db.sqlite"
`;

  if (usingNextAuth)
    content += `
# Next Auth
# On unix systems you can type: openssl rand -base64 32
# if you're using Windows you can generate one online: https://generate-secret.vercel.app/32
# Next Auth SECRET docs: https://next-auth.js.org/configuration/options#secret
# NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Next Auth Discord Provider
DISCORD_CLIENT_ID="changeme"
DISCORD_CLIENT_SECRET="changeme"
`;

  if (usingAuthJs)
    content += `
#Auth.js
# On unix systems you can type: openssl rand -hex 32
# if you're using Windows you can generate one online: https://generate-secret.vercel.app/32
# Auth.js SECRET docs: https://authjs.dev/reference/core#secret
AUTH_SECRET=""

# Auth js Discord Provider
AUTH_DISCORD_ID="changeme"
AUTH_DISCORD_SECRET="changeme"
`;
  if (!usingNextAuth && !usingPrisma)
    content += `
# Example:
# SERVERVAR="foo"
# NEXT_PUBLIC_CLIENTVAR="bar"
`;

  return content;
};

const exampleEnvContent = `
# Since the ".env" file is gitignored, you can use the ".env.example" file to
# build a new ".env" file when you clone the repo. Keep this file up-to-date
# when you add new variables to \`.env\`.

# This file will be committed to version control, so make sure not to have any
# secrets in it. If you are cloning this repo, create a copy of this file named
# ".env" and populate it with your secrets.
`
  .trim()
  .concat("\n\n");
