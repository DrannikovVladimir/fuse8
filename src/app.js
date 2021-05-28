import axios from 'axios';
import watchedState from './view';

const URL = 'https://interview-test-task-api.herokuapp.com/pages?page=';

const toUpperFirstLetter = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const updateData = (items) => items
  .map((item) => ({
    ...item,
    image: {
      jpg: `./images/${item.id}.jpg`,
      webp: `./images/${item.id}.webp`,
    },
    title: toUpperFirstLetter(item.title),
  }));

const filterData = (items, value) => items
  .filter((item) => item.title.toLowerCase().includes(value));

export default () => {
  const state = {
    status: 'loading',
    data: [],
    page: 1,
    error: null,
    filter: {
      value: '',
      data: [],
    },
  };

  const elements = {
    filter: document.querySelector('.form-filter__input'),
    button: document.querySelector('.projects__button'),
    container: document.querySelector('.projects__container-list'),
  };

  const watched = watchedState(state, elements);

  const getData = (url) => axios.get(url, { timeout: 5000 })
    .then(({ data }) => {
      const { nextPage, items } = data;
      const newData = updateData(items);
      watched.data = [...state.data, ...newData];
      watched.page = nextPage;
      watched.status = 'finished';
      watched.error = null;
    })
    .catch((err) => {
      watched.error = 'Превышено время ожидания';
      const error = new Error(err.message);
      throw error;
    });

  elements.button.addEventListener('click', () => {
    state.status = 'loading';
    getData(`${URL}${state.page}`);
  });

  elements.filter.addEventListener('input', (evt) => {
    if (evt.target.value.length <= 3) {
      watched.filter.data = state.data;
      return;
    }
    watched.filter.value = evt.target.value;
    const filteredData = filterData(state.data, evt.target.value);
    watched.filter.data = filteredData;
  });

  return getData(`${URL}${state.page}`);
};
