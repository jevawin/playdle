import captureWebsite from "capture-website";
import { readFile } from "fs/promises";
const sites = JSON.parse(
  await readFile("src/includes/scripts/sites.json")
);
for (const [key, value] of Object.entries(sites)) {
  value.games.forEach(async game => {
    await captureWebsite.file(
      game.url,
      `dist/screenshots/${encodeURI(game.name).toLowerCase()}.png`
    );
  })
}