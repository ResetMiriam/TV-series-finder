"use strict";

//****************************VAR****************************//

// input search
const searchText = document.querySelector(".js_formInput");
// button
const searchButton = document.querySelector(".js-formButton");
// ul -- to pain series
const listSeries = document.querySelector(".js-searchResult");
// form
const requestPanel = document.querySelector(".js-form");

// ul fav -- to paint favs
const listFav = document.querySelector(".js-favListCompleted");

let series = [];
let favorites = [];

//****************************FUNCTIONS****************************//

// Fetch API

function apiRequest(userSearch) {
  fetch("//api.tvmaze.com/search/shows?q=" + userSearch)
    .then((response) => response.json())
    .then((data) => {
      const seriesList = data;
      series = [];
      for (const serie of seriesList) {
        series.push(serie.show);
      }
      paintSeries();
      setInLocalStorage();
    });
  //
}

// Search input value to fetch

function handleSearch() {
  apiRequest(searchText.value);
}

// Paint search results in HTML

function paintSeries() {
  listSeries.innerHTML = "";
  let html = "";
  let favClass = "";
  for (const serie of series) {
    const isFav = isFavorite(serie);
    if (isFav) {
      favClass = "serie--favorite";
    } else {
      favClass = "";
    }
    html = `<li id=${serie.id} class= "searchResult_elem js-searchResult_elem ${favClass}">`;
    if (null === serie.image) {
      html += `<img class="searchResult_elem-img" 
        src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
        title=${serie.name} alt=${serie.name}/>`;
    } else {
      html += `<img class="searchResult_elem-img"
        src=${serie.image.medium}
        title=${serie.name} alt=${serie.name}/>`;
    }
    html += `<h3>${serie.name}</h3>`;
    html += `</li>`;
    listSeries.innerHTML += html;
    listenClickSeries();
  }
}

// Check if the serie was a favorite to the design

function isFavorite(idSerie) {
  const favoriteFound = favorites.find((idFavorite) => {
    return idFavorite.id === idSerie.id;
  });

  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

// Listen series click events to add favorites

function listenClickSeries() {
  const seriesCards = document.querySelectorAll(".js-searchResult_elem");
  for (const serieCard of seriesCards)
    serieCard.addEventListener("click", addFavorites);
}

// Add/Delete favorites

function addFavorites(ev) {
  const serieSelected = parseInt(ev.currentTarget.id);
  const serieClicked = series.find((idSerie) => {
    return idSerie.id === serieSelected;
  });
  const favAlready = favorites.findIndex((idFavorite) => {
    return idFavorite.id === serieSelected;
  });
  if (favAlready === -1) {
    favorites.push(serieClicked);
  } else {
    favorites.splice(favAlready, 1);
  }
  paintSeries();
  paintFavorites();
}

// Paint favorites results in HTML

function paintFavorites() {
  listFav.innerHTML = "";
  let htmlFav = "";

  for (const serie of favorites) {
    htmlFav = `<li id=${serie.id} class="fav_section-list js-favSectionList">`;
    htmlFav += `<button id="${serie.id}" class="js-deleteCross fav_elem-delete ">x</button>`;
    if (null === serie.image) {
      htmlFav += `<img class="fav_elem-img"
          src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
          title=${serie.name} alt=${serie.name}/>`;
    } else {
      htmlFav += `<img class="fav_elem-img"
          src=${serie.image.medium}
          title=${serie.name} alt=${serie.name}/>`;
    }
    htmlFav += `<h4 class="fav_elem-serieTitle"> ${serie.name}</h4>`;
    htmlFav += `</li>`;

    setInLocalStorage();
    listFav.innerHTML += htmlFav;
    listenClickedFavorites();
  }
}

// Listen cross button to delete favorites

function listenClickedFavorites() {
  const favCards = document.querySelectorAll(".js-deleteCross");
  for (const favCard of favCards) favCard.addEventListener("click", deleteFav);
}

// Add info to localStorage

function setInLocalStorage() {
  const stringSeries = JSON.stringify(favorites);
  localStorage.setItem("favorite", stringSeries);
}

// Get info in localStorage

function getLocalStorage() {
  const localStorageSeriesFav = localStorage.getItem("favorite");

  if (localStorageSeriesFav === null) {
    favorites = [];
  } else {
    const arraySeriesFav = JSON.parse(localStorageSeriesFav);
    favorites = arraySeriesFav;
    paintFavorites();
  }
}
// PreventDefault submit form
function handleForm(ev) {
  ev.preventDefault();
}

function favHidden() {
  const listFav = document.querySelector(".js-favArea");
  if (favSection === "") {
    listFav.classList.add("js-hidden");
  } else {
    listFav.classList.remove("js-hidden");
  }
}

//****************************EXECUTION****************************//

// PreventDefault submit form

getLocalStorage();

// Listen submit to preventDefault

requestPanel.addEventListener("submit", handleForm);

// Listen button to search

searchButton.addEventListener("click", handleSearch);
