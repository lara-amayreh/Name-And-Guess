window.addEventListener("load", onload);
document.addEventListener("DOMContentLoaded", loadInput);
const urls = [
  "https://api.genderize.io?name=",
  "https://api.agify.io?name=",
  "https://api.nationalize.io?name=",
];
let flagurl = "https://restcountries.com/v3.1/alpha?codes=";

let LocalNames = [];
function onload() {
  let names = gitLocal("name");
  if (names !== null) {
    // console.log(names);
    LocalNames = names;
    displayLocal(LocalNames);
  }
}

function displayLocal(LocalNames) {
  let GNames = document.querySelector(".guessed-names");
  LocalNames.forEach(
    (element) =>
      (GNames.innerHTML += `<p style="cursor:pointer">${element}</p>`)
  );
  let gNames = document.querySelectorAll(".guessed-names p");
  gNames.forEach((element) =>
    element.addEventListener("click", () => fetchData(element.innerHTML))
  );
}

async function fetchData(input) {
  try {
    let response = await Promise.all(
      urls.map((url) => fetch(url + input).then((response) => response.json()))
    );
    let furl = flagurl;
    let FlagsCode = response[2].country;
    FlagsCode.forEach((code) => (furl += code.country_id + ","));
    let flagsResponse = await fetch(furl).then((flagsResponse) =>
      flagsResponse.json()
    );
    displayResponse(response);
    displayFlags(arrangeFlags(FlagsCode, flagsResponse));
    saveLocal("name", input);
  } catch (error) {
    console.log("Error", error);
  }
}

function arrangeFlags(code, res) {
  let arr = new Array(res);
  for (let i = 0; i < res.length; i++) {
    for (let j = 0; j < code.length; j++)
      if (code[i].country_id == res[j].cca2) arr[i] = res[j];
  }
  return arr;
}

function displayFlags(flagsResponse) {
  let flagContainer = document.querySelector(".flags");
  let result = `<h6 class="py-3 text-white-50">Guessed Countries are : </h6> `;
  flagsResponse.forEach(function (element, index) {
    if (index < 3) {
      result += `<div class="col-md-4 col-lg-4 mb-3" ><div class = "card h-100 text-white bg-secondary">
  <img class="card-img-top h-100 overflow-hidden" src='${element.flags.png}' alt="flag image">
  <div class="card-body">
    <h5 class="card-title text-center">${element.name.common}</h5>
    </div>
  </div>
</div>`;
    }
  });
  flagContainer.innerHTML = `${result}`;
}

function displayResponse(response) {
  let Results = document.querySelector(".results");
  Results.innerHTML =
    `<div><p> Hello  ${response[0].name} </p> <p>Guessed Gender Is : ${response[0].gender}</p>` +
    `<p>Guessed Age Is : ${response[1].age}</p>
    </div>`;
}
function saveLocal(key, value) {
  if (!LocalNames.includes(value)) {
    LocalNames.push(value);
    localStorage.setItem(key, JSON.stringify(LocalNames));
  }
}

function gitLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}
function loadInput() {
  let Name = document.querySelector(".Name");
  let dvMessage = document.querySelector(".dvMessage");
  Name.addEventListener("keydown", function (event) {
    if (event.keyCode === 32) {
      event.preventDefault();
      dvMessage.textContent = " You can not Enter a space";
      dvMessage.className = "alert alert-dark";
      setTimeout(() => resetAlert(), 1500);
    } else if (event.key === "Enter") {
      fetchData(Name.value);
      Name.value = "";
    }
  });
}
let Name = document.querySelector(".Name");
let Guess = document.querySelector(".Guess");
Guess.addEventListener("click", function () {
  fetchData(Name.value);
  Name.value = "";
});

let dvMessage = document.querySelector(".dvMessage");
function resetAlert() {
  dvMessage.textContent = "";
  dvMessage.classList.remove("alert-dark");
}
