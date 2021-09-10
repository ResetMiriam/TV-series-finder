"use strict";

//----------DECLARACIONES-------------//

// input
const searchText = document.querySelector(".js_search-input");
// button
const searchButton = document.querySelector(".js-search-button");
// ul
const listSeries = document.querySelector(".js-searchResult");
// form
const requestPanel = document.querySelector(".js-form");

// para utilizar
let series = [];
let userSearch = "";
let favorites = [];

//----------FUNCIONES-------------//
// petición api

function apiRequest(userSearch) {
  fetch("//api.tvmaze.com/search/shows?q=" + userSearch)
    .then((response) => response.json())
    .then((data) => {
      series = [];
      for (const serie of data) series.push(serie.show);
      console.log(series);
      paintSeries();
    });
  //
}
// plasmar series
function paintSeries() {
  let html = "";
  for (const serie of series) {
    html = `<li id=${serie.id} class="searchResult_elem js-searchResult_elem">`;
    if (null === serie.image) {
      html += `<img class="searchResult_elem-img" 
        src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
        title=${serie.name} alt=${serie.name}/>`;
    } else {
      html += `<img class="searchResult_elem-img"
        src=${serie.image.medium}
        title=${serie.name} alt=${serie.name}/>`;
    }
    html += `<h2>${serie.name}</h2>`;
    html += `</li>`;
    listSeries.innerHTML += html;
  }
}

// preventDefault
function handleForm(ev) {
  ev.preventDefault();
}
// busqueda con la info del input
function handleSearch() {
  apiRequest(searchText.value);
}

//----------EVENTOS Y DEMÁS-------------//

// cuando se pulsa el boton -- busqueda con la info del input
searchButton.addEventListener("click", handleSearch);
// cuando se envía el form -- preventDefault
requestPanel.addEventListener("submit", handleForm);
