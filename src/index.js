import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let searchName;


searchBox.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));


function onInputCountry() {
  searchName = searchBox.value.trim();
  console.dir(searchName)
  fetchCountries(searchName)
    .then(data => {
      clearConteiner();
      console.log(data);
      createText(data);
    })
    .catch(error => {
      console.log(error);
      clearConteiner();
      if (searchName !== '') {
        textError();
      }
    });
}

function createText(data) {
  if (data.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (data.length >= 2 && data.length <= 10) {
    const markupList = textList(data);
    countryList.insertAdjacentHTML('beforeend', markupList);
  }
  if (data.length === 1) {
    const markupInfo = textInfo(data);
    countryInfo.insertAdjacentHTML('beforeend', markupInfo);
  }
}

function textList(data) {
  return data
    .map(({ flags, name }) => {
      return `<li class = "box">
      <img
        src="${flags.svg}"
        alt="country flag"
        width="20";
      />
      <p class = "country">${name}</p>
    </li>`;
    })
    .join('');
}

function textInfo(data) {
  return data.map(({ flags, name, languages, capital, population }) => {
      return `<div class = "box">
      <img
        src="${flags.svg}"
        alt="country flag"
        width="30";
      />
      <p class = "country">${name}</p>
    </div>
    <p class="text_bold">Capital: <span>${capital}</span></p>
    <p class="text_bold">Population: <span>${population}</span></p>
    <p class="text_bold">Languages: <span>${languages
      .map(language => language.name)
      .join(', ')}</span></p>
    `;
    })
    .join('');
}
function textError() {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}
function clearConteiner() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}