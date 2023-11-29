/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // NextAuth.js
  "next-auth": "^4.24.5",
  "@next-auth/prisma-adapter": "^1.0.7",

  // Auth.js
  "@auth/core": "^0.18.3",
  "@auth/prisma-adapter": "^1.0.7",

  // shadcn/ui TODO: on hold since we're forcing users to do it manually
  clsx: "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "tailwindcss-animate": "^1.0.7",
  "@radix-ui/react-icons": "^1.3.0",

  // this is required by the button component
  "class-variance-authority": "^0.7.0",

  // Prisma
  prisma: "^5.6.0",
  "@prisma/client": "^5.6.0",

  // TailwindCSS
  tailwindcss: "^3.3.5",
  autoprefixer: "^10.4.14",
  postcss: "^8.4.31",
  prettier: "^3.1.0",
  "prettier-plugin-tailwindcss": "^0.5.7",
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
