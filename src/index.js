import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const containerEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(event) {
  const countryName = event.target.value.trim();
  clearInput();
  fetchCountries(countryName)
    .then(data => {
      if (data.length === 1) {
        makeCardMarkup(data);
      }

      if (data.length <= 10 && data.length > 1) {
        makeCard(data);
      }

      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      console.log(error);
        Notify.failure('Oops, there is no country with that name');
    });
}

function makeCard(countries) {
  const makeElementMarkup = ({ flags, name }) => {
    return `
        <li class="list_item">
            <img class="list_img" src="${flags.svg}" alt="${name.official}" width=50 height=30>
            <p class="list_text">${name.official}</p>
        </li>`;
  };

  const markup = countries.map(makeElementMarkup).join('');

  listEl.insertAdjacentHTML('beforeend', markup);
}

function makeCardMarkup(manyCountries) {
  const makeCard = ({ capital, name, population, languages, flags }) => {
    return `
        <div class="country_header">
        <img class="list_img" src="${flags.svg}" alt="${
      name.official
    }" width=100> </div>
            <h1 class="country_title">${name.official}</h1>
        <ul class="country_card_list">
            <li class="country_item">
                <p class="country_key">Capital:</p>
                <p class="country_value">${capital}</p>
            </li>
            <li class="country_item">
                <p class="country_key">Population:</p>
                <p class="country_value">${population}</p>
            </li>
            <li class="country_item">
                <p class="country_key">Languages:</p>
                <p class="country_value">${Object.values(languages).join(
                  ', '
                )}</p>
            </li>
        </ul>
        `;
  };

  const markup = manyCountries.map(makeCard);

  containerEl.insertAdjacentHTML('beforeend', markup);
}

function clearInput() {
  containerEl.innerHTML = '';
  listEl.innerHTML = '';
}
