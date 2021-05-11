import axios from 'axios';
import watchedState from './view';

const URL = 'https://603e38c548171b0017b2ecf7.mockapi.io/homes';

const getData = (url) => axios.get(url, { timeout: 5000 });

const getRandomNumber = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

const toUpperFirstLetter = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const updateData = (items) => items
  .map((item) => ({
    ...item,
    image: `./images/${getRandomNumber(1, 6)}.jpg`,
    title: toUpperFirstLetter(item.title),
  }));

const filterData = (items, value) => items
  .filter((item) => item.title.toLowerCase().includes(value));

export default () => {
  const state = {
    status: 'loading',
    data: [],
    error: null,
    filter: {
      value: '',
      data: [],
    },
  };

  const filter = document.querySelector('.form-filter__input');
  const container = document.querySelector('.projects__container-list');
  const watched = watchedState(state, container);

  filter.addEventListener('input', (evt) => {
    if (evt.target.value.length <= 3) {
      watched.filter.data = state.data;
      return;
    }
    watched.filter.value = evt.target.value;
    const filteredData = filterData(state.data, evt.target.value);
    watched.filter.data = filteredData;
  });

  return getData(URL)
    .then(({ data }) => {
      const newData = updateData(data);
      watched.data = [...state.data, ...newData];
      watched.status = 'finished';
      watched.error = null;
    })
    .catch((err) => {
      watched.networkError = 'Превышено время ожидания';
      const error = new Error(err.message);
      throw error;
    });
};
