"use strict";

//----------DECLARACIONES-------------//

// input filter
const searchText = document.querySelector(".js_formInput");
// button
const searchButton = document.querySelector(".js-formButton");
// ul -- donde se pintan series - selecciono donde se pintan
const listSeries = document.querySelector(".js-searchResult");
// form
const requestPanel = document.querySelector(".js-form");

// ul fav -- donde se pintan los favoritos
const listFav = document.querySelector(".js-favListCompleted");

// para utilizar
let series = [];
let favorites = [];

//----------FUNCIONES-------------//

//busqueda
// OK busqueda con la info del input
function handleSearch() {
  apiRequest(searchText.value);
}

// Añadimos la informacion al local storage
function setInLocalStorage() {
  // stringify me permite transformar a string el array de palettes
  const stringSeries = JSON.stringify(favorites);
  //añadimos  al localStorage  los datos convertidos en string previamente
  localStorage.setItem("favorite", stringSeries);
}

// OK petición api
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

function getLocalStorage() {
  // obtenermos lo que hay en el LS
  const localStorageSeriesFav = localStorage.getItem("favorite");
  // siempre que cojo datos del local storage tengo que comprobar si son válidos
  // es decir si es la primera vez que entro en la página
  if (localStorageSeriesFav === null) {
    // no tengo datos en el local storage, así que llamo al API
    favorites = [];
  } else {
    // sí tengo datos en el local storage, así lo parseo a un array y
    const arraySeriesFav = JSON.parse(localStorageSeriesFav);
    // lo guardo en la variable global de palettes
    favorites = arraySeriesFav;
    // cada vez que modifico los arrays de palettes o de favorites vuelvo a pintar y a escuchar eventos
    paintFavorites();
  }
}

getLocalStorage();

// OK plasmar series
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

// OK
function isFavorite(idSerie) {
  //compruebo si la paleta que recibo por parámetro está en los favoritos
  const favoriteFound = favorites.find((idFavorite) => {
    // la dificultad de esta función interna del find es saber que tengo que comparar
    // yo consolearía console.log(fav, palette) para ver los datos que debo comparar
    return idFavorite.id === idSerie.id;
  });
  //find devuelve undefined si no lo encuentra, es decir sino esta en el array de favoritos
  //retorno si está o no está en favoritos
  if (favoriteFound === undefined) {
    //retorno false cuando NO está favoritos
    return false;
  } else {
    //retorno true cuando SI está favoritos
    return true;
  }
}

// OK escuchar click en cada serie
function listenClickSeries() {
  const seriesCards = document.querySelectorAll(".js-searchResult_elem");
  for (const serieCard of seriesCards)
    serieCard.addEventListener("click", addFavorites);
}

//  OK comprobar si la clicada está en favoritos
function addFavorites(ev) {
  //sacar ID
  const serieSelected = parseInt(ev.currentTarget.id);
  // OK comparar arrayFavorites con ID
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

// OK plasmar favoritos
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

// OK escuchar click en cada favorito
function listenClickedFavorites() {
  const favCards = document.querySelectorAll(".js-deleteCross");
  for (const favCard of favCards) favCard.addEventListener("click", deleteFav);
}

function deleteFav(ev) {
  const favClicked = parseInt(ev.currentTarget.id);
  const favSelected = favorites.findIndex((idFav) => idFav.id === favClicked);
  favorites.splice(favSelected, 1);
  paintSeries();
  paintFavorites();
}

function favHidden() {
  const favSection = document.querySelector(".js-favArea");
  if ((favSection.innerHTML = "")) {
    favSection.classList.add("js-hidden");
  } else {
    favSection.classList.remove("js-hidden");
  }
}

// preventDefault
function handleForm(ev) {
  ev.preventDefault();
}

//----------EVENTOS Y DEMÁS-------------//

// cuando se pulsa el boton -- busqueda con la info del input
searchButton.addEventListener("click", handleSearch);
// cuando se envía el form -- preventDefault
requestPanel.addEventListener("submit", handleForm);
