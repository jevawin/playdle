import captureWebsite from "capture-website";
import { readFile } from "fs/promises";

// capture settings
const settings = {
  width: 300,
  height: 225,
  overwrite: true,
  type: "jpeg",
  removeElements: ["#pz-gdpr", "[id*='sp_message_container']"],
};

// get urls
const sites = JSON.parse(await readFile("src/includes/scripts/sites.json")).sites;

// loop and capture
(async () => {
  for await (const [key, value] of Object.entries(sites)) {
    for (const game of value.games) {
      await captureWebsite.file(
        game.url,
        `dist/screenshots/${encodeURI(game.name.replaceAll(" ", "_")).toLowerCase()}.${settings.type}`,
        settings
      );
    }
  }
})();
