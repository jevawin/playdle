fetch("sites.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let main = document.querySelector("main");
    let html = ``;
    for (const [key, value] of Object.entries(data)) {
      html += `<div class="font-bold">${key}</div><div class="">${value.description}</div><div class="grid gap-4 grid-cols-2 md:grid-cols-3">`;
      value.games.forEach(game => {
        html += `
        <div class="rounded overflow-hidden">
          <img src="screenshots/${encodeURI(game.name.replaceAll(" ", "_")).toLowerCase()}.png" style="w-10 h-auto rounded" />
          <p>${game.name}</p>
          <p>${game.description}</p>
          <p>${game.url}</p>
        </div>
        `;
      });
      html += `</div>`;
    }
    main.innerHTML = html;
  });
