const gamesContainer = document.querySelector("#games-post");
let fixtures;

const getCurrentDate = () => {
  const todayCalender = new Date();
  const date = todayCalender.getDate().toString();
  const finalDate = date.length === 1 ? "0" + date : date;
  const month = (() =>
    todayCalender.getMonth() + 1 < 10
      ? `0${(todayCalender.getMonth() + 1).toString()}`
      : todayCalender.getMonth() + 1)();
  const year = todayCalender.getFullYear().toString();

  return `${year}-${month}-${finalDate}`;
};
let today = getCurrentDate();
console.log(today);

let myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "44db5dfec8b39bbd7f73002a79d90313");
myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

fetch(`https://v3.football.api-sports.io/fixtures?date=${today}&status=NS`, {
  headers: myHeaders,
})
  .then((jsonData) => jsonData.json())
  .then((result) => {
    fixtures = result.response;
    appendGames(result.response);
    gameContainerDrop();
  })
  .catch((error) => console.log("error", error));

const appendGames = (fixtureArr) => {
  while (gamesContainer.hasChildNodes()) {
    gamesContainer.removeChild(gamesContainer.firstChild);
  }

  fixtureArr.forEach((gameObj) => {
    const div = document.createElement("div");
    div.classList.add("container", "game-container", "text-capitalize", "fw-bold", "p-2", "my-4");
    gamesContainer.appendChild(div);

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

const country = document.querySelector("#countries");

country.addEventListener("change", () => {
  myFilter(country.value);
});

const myFilter = (country) => {
  let filteredArr = [];
  if (country !== "Country") {
    fixtures.forEach((gameObj) => {
      if (gameObj.league.country === country) {
        filteredArr.push(gameObj);
      }
    });
    appendGames(filteredArr);
  } else {
    appendGames(fixtures);
  }
};

const gameContainerDrop = () => {
  const gameContainer = document.querySelectorAll(".game-container");
  gameContainer.forEach((game) => {
    game.addEventListener("click", () => {
      appendPredictForm(game);
    });
  });
};

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
const predictDiv = document.createElement("div");

const appendPredictForm = (gameDiv) => {
  insertAfter(gameDiv, predictDiv);
  const form = document.createElement("form");
  form.classList.add("container", "predict-form", "my-4", "p-3");
  predictDiv.appendChild(form);

  const inputDiv = document.createElement("div");
  inputDiv.classList.add("container", "row", "justify-content-center");
  form.appendChild(inputDiv);

  const homeScoreInput = document.createElement("input");
  homeScoreInput.classList.add("predict-input", "form-control", "col", "align-self-center");
  homeScoreInput.setAttribute("type", "number");
  homeScoreInput.setAttribute("placeholder", "0");
  homeScoreInput.setAttribute("min", "0");
  homeScoreInput.setAttribute("id", "home");
  homeScoreInput.setAttribute("aria-label", "home score");
  inputDiv.appendChild(homeScoreInput);

  const span = document.createElement("span");
  span.classList.add("col-2", "text-center", "fw-bold", "align-self-center");
  inputDiv.appendChild(span);
  span.textContent = "-";

  const awayScoreInput = document.createElement("input");
  awayScoreInput.classList.add("predict-input", "form-control", "col", "align-self-center");
  awayScoreInput.setAttribute("type", "number");
  awayScoreInput.setAttribute("placeholder", "0");
  awayScoreInput.setAttribute("min", "0");
  awayScoreInput.setAttribute("id", "away");
  awayScoreInput.setAttribute("aria-label", "away score");
  inputDiv.appendChild(awayScoreInput);

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("d-grid", "gap-2", "col-6", "mx-auto", "my-3");
  form.appendChild(buttonDiv);

  const predictBtn = document.createElement("button");
  predictBtn.classList.add("btn", "btn-success", "fw-bold");
  predictBtn.setAttribute("type", "submit");
  predictBtn.textContent = "Predict";
  buttonDiv.appendChild(predictBtn);

  const submitForm = document.querySelector("form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const away = document.querySelector("#away").value;
    const home = document.querySelector("#home").value;
    showPrediction(home, away);
  });
};

const showPrediction = (home, away) => {
  let userPredictionDiv = document.createElement("div");
  userPredictionDiv.innerHTML = `
            <div class="user-prediction p-1 my-2">
              <div class="container row align-items-center">
                <div class="col upvote">
                  <i class="upvote-arrow fa-solid fa-circle-arrow-up"></i>
                  <p class="likes d-inline-block mb-0">0</p>
                </div>
                <p class="col-6 prediction-score mb-0">
                  <span id="homeScore">${home}</span>
                  <span>-</span>
                  <span id="awayScore">${away}</span>
                </p>
              </div>
            </div>
  `;
  predictDiv.appendChild(userPredictionDiv);

  const upvoteBtn = document.querySelector(".upvote");
  upvoteBtn.addEventListener("click", () => {
    const votes = document.querySelector(".likes");

    if (!upvoteBtn.classList.contains("liked")) {
      upvoteBtn.classList.add("liked");
      votes.textContent = (parseInt(votes.textContent) + 1).toString();
    } else {
      upvoteBtn.classList.remove("liked");
      votes.textContent = (parseInt(votes.textContent) - 1).toString();
    }
  });
};
