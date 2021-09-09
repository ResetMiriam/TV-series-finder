"use strict";

const listSeries = document.querySelector(".searchResult");
let series = [];

fetch("https://api.tvmaze.com/shows")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    series = [data.palettes];
  });
