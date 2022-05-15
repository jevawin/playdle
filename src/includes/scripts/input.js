fetch("sites.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let main = document.querySelector("main");
    let html = ``;
    for (const [key, value] of Object.entries(data)) {
      html += `<div class="mb-6"><h1 class="font-bold text-2xl uppercase">${key}</h1><p class="">${value.description}</p><div class="grid gap-2 grid-cols-2 md:grid-cols-3">`;
      value.games.forEach((game) => {
        const image = `/screenshots/${encodeURI(game.name.replaceAll(" ", "_")).toLowerCase()}.webp`;
        html += `
        <div class="rounded overflow-hidden shadow flex flex-col justify-start p-2 bg-slate-600 bg-[url('${image}')]">
          <img src="${image}"
            class="w-full h-auto rounded overflow-hidden" loading="lazy" />
          <h2 class="font-bold text-lg mt-2">${game.name}</h2>
          <p class="mb-2">${game.description}</p>
          <a target="_blank" href="${
            game.url
          }" class="block rounded bg-green-600 text-white font-bold px-2 py-3 text-center border-green-700 border-b-2 border-r-2 active:border-r-0 active:border-b-0 transition-all justify-self-end mt-auto">Play ${
          game.name
        }</a>
        </div>
        `;
      });
      html += `</div></div>`;
    }
    main.innerHTML = html;
  });
