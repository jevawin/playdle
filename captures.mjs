import captureWebsite from "capture-website";
import { readFile } from "fs/promises";

// capture settings
const settings = {
  width: 600,
  height: 400,
  overwrite: true,
  type: "jpeg",
  removeElements: ["#pz-gdpr", "[id*='sp_message_container']"],
};

// get urls
const sites = JSON.parse(await readFile("src/includes/scripts/sites.json")).sites;

// loop and capture
(async () => {
  for await (const [key, value] of Object.entries(sites)) {
    for await (const game of value.games) {
      const start = new Date().getTime();
      console.log(`Capturing ${game.name}`);
      await captureWebsite.file(
        game.url,
        `dist/screenshots/${encodeURI(game.name.replaceAll(" ", "_")).toLowerCase()}.${settings.type}`,
        settings
      );
      const end = new Date().getTime();
      console.log(`Captured ${game.name} in ${end - start}ms`);
    }
  }
})();
