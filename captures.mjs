import captureWebsite from "capture-website";
import { readFile } from "fs/promises";

// capture settings
const settings = {
  width: 300,
  height: 225,
  overwrite: true,
  removeElements: ["#pz-gdpr", "[id*='sp_message_container']"],
};

// get urls
const sites = JSON.parse(await readFile("src/includes/scripts/sites.json"));

// loop and capture
(async () => {
  for await (const [key, value] of Object.entries(sites)) {
    for await (const game of value.games) {
      for await (const ext of ["webp", "jpeg"]) {
        const localSettings = settings;
        localSettings.type = ext;
        await captureWebsite.file(game.url, `dist/screenshots/${encodeURI(game.name.replaceAll(" ", "_")).toLowerCase()}.${ext}`, settings);
      }
    };
  }
})();
