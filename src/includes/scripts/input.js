fetch("sites.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let main = document.querySelector("main");
    let html = ``;
    for (const [key, value] of Object.entries(data)) {
      html += `<div class="font-bold">${key}</div><div class="">${value.description}</div><div class="grid gap-4 grid-cols-3">`;
      value.games.forEach(game => {
        html += `<div><img src="screenshots/${encodeURI(game.name).toLowerCase()}.png" style="w-10 h-auto" /><div>${
          game.name
        }</div>`;
        html += `<div>${game.description}</div>`;
        html += `<div>${game.url}</div></div>`;
      });
      html += `</div>`;
    }
    main.innerHTML = html;
  });
