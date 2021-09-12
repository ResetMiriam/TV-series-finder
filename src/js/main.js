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
    });
  //
}

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

/* - [x] Diagrama de flujo (esquema)
- [ ] Hacer la estructura del HTML, css minimo para trabajar
- [] Pintar una serie
  -  [ ] Seleccionar los elementos del HTML donde voy a pintar la lista de series
  - [ ] Hacer peticion al servidor FETCH
  - [ ] Parsear los datos del servidor .json()
  - [ ] guardar en una variable global y
  - [ ] pintar en el HTML los datos
  - [ ] ponerlo bonito
- [ ] Pintar muchas series
- [ ] Seleccionar paletas favorita
  - [ ] Escuchar evento sobre CLICK sobre las paletas
  - [ ] Crear una funcion manejadora del evento
  - [ ] Identificar la paleta clicada
  - [ ] Añadir a un array de favorito la paleta clicada
  - [ ] añadir o quitar la clase en el HTML de las paletas clicadas
- [ ] Localstorage
- [ ] Filtrar por nombre
  - [ ] Definir el input del buscador
  - [ ] Escuchar un evento sobre el input,
  - [ ] filtrar
  - [ ] pintar html los datos filtrados */
