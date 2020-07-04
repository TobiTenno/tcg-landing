'use strict';

const $ = require('jquery');
require('popper.js');
require('bootstrap');

const initTooltips = () => {
  $('[data-toggle="tooltip"]').tooltip({ html: true });
};

const safeGetCache = () => {
  const rawCache = localStorage.getItem('sccache');
  try {
    return JSON.parse(rawCache);
  } catch (ignored) {
    return {};
  }
}

const cachedCards = safeGetCache();

const getCardInfo = (name) => {
  console.log(`scryfall hit! ${name}`);
  const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(name)}&format=json&pretty=false&unique=true`;
  const rawscryfall = $.ajax({
    type: 'GET',
    url,
    async: false,
  }).responseJSON.data[0];
  
  
  return {
    name: rawscryfall.name,
    image: rawscryfall.image_uris.png,
    url: rawscryfall.scryfall_uri,
  };
};

const initCards = () => {
  console.debug('processing card info...');
  const cards = $('[data-card]');
  for (let i = 0; i < cards.length; i++) {
    const cardElem = $(cards[i]);
    const card = cardElem.attr('data-card');
    let info;
    const cacheHits = Object.keys(cachedCards).find(cache => cache.includes(card));
    if (cacheHits) {
      console.log(`cache hit! ${cacheHits}`);
      info = cachedCards[cacheHits];
    } else {
      info = getCardInfo(card);
      cachedCards[info.name] = info;
    }
    if (info) {
      cardElem
        .attr('title', `<img src="${info.image}" width="250px" alt="${info.name}">`)
        .attr('href', info.url);
      cardElem.find('span').text(info.name)
    } else {
      cardElem.attr('title', 'Failed to fetch ');
    }
  }
  
  localStorage.setItem("sccache", JSON.stringify(cachedCards))
}

$(document).ready(() =>{
  initCards();
  initTooltips();
});

