import gradient from "gradient-string";

import { TITLE_TEXT } from "~/consts.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";

export const renderTitle = () => {
  const titleGradient = gradient(["#860A35", "#872341", "#BE3144", "#F05941"]);

  // resolves weird behavior where the ascii is offset
  const pkgManager = getUserPkgManager();
  if (pkgManager === "yarn" || pkgManager === "pnpm") {
    console.log("");
  }
  console.log(titleGradient.multiline(TITLE_TEXT));
};
