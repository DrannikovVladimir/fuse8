import axios from 'axios';
import watchedState from './view';

const URL = `https://interview-test-task-api.herokuapp.com/pages?page=1`;

const getData = (url) => axios.get(url, { timeout: 5000 });

const toUpperFirstLetter = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const updateData = (items) => items
  .map((item, index) => ({
    ...item,
    image: {
      jpg: `./images/${index + 1}.jpg`,
      webp: `./images/${index + 1}.webp`,
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

  const getItems = (page) => {
    const data = axios.get(`https://interview-test-task-api.herokuapp.com/pages?page=${page}`)
      .then((response) => {
        if (response === null) {
          watched.page = null;
        }
        const { data: { nextPage, items }} = response;
        watched.page = nextPage;
        const newData = updateData(items);
        watched.data = [...state.data, ...newData];
      })
      .catch((err) => {
        watched.error = err.message;
      });

    return data;
  };

  elements.button.addEventListener('click', () => {
    getItems(state.page);    
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

  return getData(URL)
    .then(({ data }) => {
      const { items } = data;
      const newData = updateData(items);
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
