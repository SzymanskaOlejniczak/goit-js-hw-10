import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  outputClear();
  if (e.target.value.trim() != '') {
    fetchCountries(e.target.value.trim())
      .then(renderHTML)
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
       
      });
  }
}

function outputClear() {
  listEl.innerHTML = '';
  divEl.innerHTML = '';
}

function renderHTML(country) {
  if (country.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (country.length >= 2 && country.length <= 10) {
    renderCountriesList(country);
  } else if (country.length === 1) {
    renderCountryCard(country);
  }
}

function renderCountriesList(countriesArr) {
  const markup = countriesArr
    .map(({ flags, name }) => {
      return `<li>
        <img src="${flags.svg}" width="100px">
        <p>${name.official}</p>
        </li>`;
    })
    .join('');
  listEl.insertAdjacentHTML('beforeend', markup);
}

function renderCountryCard(response) {
    const markup = response
    .map(el => {
        return `<div><img class="img" src="${
            el.flags.svg
        }" width=100 alt="flag">
        <h1>${el.name.official}</h1></div>
        <ul >
        <li ><span class='inforamtion'>Capital:
          </span>${el.capital}</li>
        <li ><span class='inforamtion'>Population:
          </span>${el.population}</li>
        <li ><span class='inforamtion'>Languages:
          </span>${Object.values(el.languages)}</li>
      </ul>`;
        })
        .join('');
        divEl.insertAdjacentHTML('beforeend', markup);
}