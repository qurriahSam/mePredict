const gameContainer = document.querySelector("#games-post");

const getCurrentDate = () => {
  const todayCalender = new Date();
  const date = todayCalender.getDate().toString();
  const month = (() =>
    todayCalender.getMonth() + 1 < 10
      ? `0${(todayCalender.getMonth() + 1).toString()}`
      : todayCalender.getMonth() + 1)();
  const year = todayCalender.getFullYear().toString();

  return `${year}-${month}-${date}`;
};
let today = getCurrentDate();
console.log(today);

let myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "44db5dfec8b39bbd7f73002a79d90313");
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
  headers: myHeaders,
})
  .then((jsonData) => jsonData.json())
  .then((result) => {
    console.log(result);
    appendGames(result.response);
  })
  .catch((error) => console.log("error", error));

const appendGames = (fixtureArr) => {
  console.log(fixtureArr);
  fixtureArr.forEach((gameObj) => {
    //console.log(gameObj.teams.home.name, gameObj.teams.away.name);
    const div = document.createElement("div");
    div.classList.add(
      "container",
      "game-container",
      //"text-center",
      "text-capitalize",
      "fw-bold",
      "p-2",
      "my-4"
    );
    gameContainer.appendChild(div);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("d-flex", "justify-content-around", "align-items-center", "px-4");
    div.appendChild(rowDiv);

    const homeLogo = document.createElement("img");
    homeLogo.classList.add("col", "mb-0", "team-logo");
    rowDiv.appendChild(homeLogo);
    homeLogo.setAttribute("src", `${gameObj.teams.home.logo}`);

    const home = document.createElement("p");
    home.classList.add("col", "mb-0", "ps-3");
    rowDiv.appendChild(home);
    home.textContent = gameObj.teams.home.name;

    const dash = document.createElement("p");
    dash.classList.add("col", "mb-0", "text-center");
    rowDiv.appendChild(dash);
    dash.textContent = " - ";

    const awayLogo = document.createElement("img");
    awayLogo.classList.add("col", "mb-0", "team-logo");
    rowDiv.appendChild(awayLogo);
    awayLogo.setAttribute("src", `${gameObj.teams.away.logo}`);

    const away = document.createElement("p");
    away.classList.add("col", "mb-0", "ps-3");
    rowDiv.appendChild(away);
    away.textContent = gameObj.teams.away.name;
  });
};
